ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS minecraft_gamertag text,
  ADD COLUMN IF NOT EXISTS fortnite_nickname text,
  ADD COLUMN IF NOT EXISTS games text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.lesson_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_messages_lesson ON public.lesson_messages(lesson_id, created_at);

GRANT SELECT, INSERT ON public.lesson_messages TO authenticated;
GRANT ALL ON public.lesson_messages TO service_role;

ALTER TABLE public.lesson_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_messages_read_participants"
  ON public.lesson_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      WHERE l.id = lesson_messages.lesson_id
        AND l.student_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'teacher')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "lesson_messages_insert_participants"
  ON public.lesson_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM public.lessons l
        WHERE l.id = lesson_messages.lesson_id
          AND l.student_id = auth.uid()
      )
      OR public.has_role(auth.uid(), 'teacher')
      OR public.has_role(auth.uid(), 'admin')
    )
  );

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'teacher'::app_role FROM auth.users u
WHERE u.email = 'projektista@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE u.email = 'projektista@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.grant_founder_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'projektista@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'teacher')
      ON CONFLICT (user_id, role) DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_founder_roles() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_grant_founder_roles ON auth.users;
CREATE TRIGGER trg_grant_founder_roles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_founder_roles();