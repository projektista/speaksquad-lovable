-- Real-date teacher availability slots (replaces weekly-generic model on the UI side).
-- Apply this against your standalone Supabase project.

create table if not exists public.teacher_availability_slots (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  duration_min int not null default 60,
  status text not null default 'available' check (status in ('available','blocked')),
  created_at timestamptz not null default now(),
  unique (teacher_id, starts_at)
);

create index if not exists idx_tas_teacher_starts on public.teacher_availability_slots (teacher_id, starts_at);
create index if not exists idx_tas_starts_available on public.teacher_availability_slots (starts_at) where status = 'available';

grant select on public.teacher_availability_slots to anon;
grant select, insert, update, delete on public.teacher_availability_slots to authenticated;
grant all on public.teacher_availability_slots to service_role;

alter table public.teacher_availability_slots enable row level security;

-- Anyone can read available future slots (so students see what to book)
drop policy if exists "tas_public_read_available" on public.teacher_availability_slots;
create policy "tas_public_read_available"
  on public.teacher_availability_slots
  for select
  to anon, authenticated
  using (status = 'available' and starts_at > now());

-- Teacher/admin manage their own slots
drop policy if exists "tas_owner_read" on public.teacher_availability_slots;
create policy "tas_owner_read"
  on public.teacher_availability_slots
  for select
  to authenticated
  using (teacher_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "tas_owner_write" on public.teacher_availability_slots;
create policy "tas_owner_write"
  on public.teacher_availability_slots
  for all
  to authenticated
  using (teacher_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
  with check (teacher_id = auth.uid() or public.has_role(auth.uid(), 'admin'));