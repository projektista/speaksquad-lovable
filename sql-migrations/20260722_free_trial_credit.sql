-- Grant every new student 1 free credit lot (30-day expiration) on signup.
-- Founders (teacher/admin — projektista@gmail.com) are excluded, since they
-- don't consume lessons as students.
--
-- Apply this against your standalone Supabase project. It replaces the
-- existing public.handle_new_user() trigger function so the trigger already
-- registered on auth.users automatically picks up the new body.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name',''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Free trial credit: 1 lot, expires 30 days after signup.
  -- Behaves exactly like a paid lot (FIFO reserve/consume/release).
  IF NEW.email IS DISTINCT FROM 'projektista@gmail.com' THEN
    INSERT INTO public.credit_lots (user_id, expires_at, source, note)
    VALUES (
      NEW.id,
      now() + interval '30 days',
      'free_trial',
      'Signup free trial credit'
    );
  END IF;

  RETURN NEW;
END;
$$;