-- Adds the missing teacher_id column to public.lessons.
--
-- Context: booking.functions.ts and lesson.functions.ts already read/write
-- lessons.teacher_id, but the column was never created on this table (only
-- teacher_availability_slots.teacher_id exists). This was masked in code by
-- (as any) casts until the types.ts regeneration on 2026-07-25 exposed the
-- mismatch. Confirmed via information_schema.columns that lessons has no
-- teacher_id today.
--
-- Effect without this migration: booking.functions.ts' insert into lessons
-- (which sets teacher_id: slot.teacher_id) fails at the database level, so
-- scheduling a lesson is currently broken end-to-end.
--
-- Apply this against your standalone Supabase project (SQL Editor or CLI).

ALTER TABLE public.lessons
  ADD COLUMN teacher_id uuid REFERENCES auth.users(id);

-- Backfill any existing rows (test lessons created before this fix) with the
-- founder account, since there is currently only one teacher.
UPDATE public.lessons
SET teacher_id = (SELECT id FROM auth.users WHERE email = 'projektista@gmail.com')
WHERE teacher_id IS NULL;

-- Index for lookups filtering lessons by teacher (dashboard, alunos panel).
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON public.lessons(teacher_id);