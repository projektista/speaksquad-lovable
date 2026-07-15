
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'student');
CREATE TYPE public.english_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.game_mode AS ENUM ('minecraft', 'fortnite');
CREATE TYPE public.lesson_status AS ENUM (
  'scheduled',
  'completed',
  'student_cancelled',
  'late_cancel',
  'no_show',
  'teacher_cancelled'
);
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'deduction', 'refund');
CREATE TYPE public.cancelled_by_actor AS ENUM ('student', 'teacher', 'system');

-- =========================================================
-- updated_at helper
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  english_level public.english_level,
  bio TEXT,
  preferred_game public.game_mode,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- user_roles + has_role (SECURITY DEFINER, no recursion)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Profiles policies
CREATE POLICY "profiles_self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profiles_self_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- user_roles policies (read own; admins read all; only service_role writes)
CREATE POLICY "user_roles_self_select" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- credits (balance + reserved hold)
-- =========================================================
CREATE TABLE public.credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT credits_non_negative CHECK (balance >= 0 AND reserved >= 0),
  CONSTRAINT credits_reserved_le_balance CHECK (reserved <= balance)
);
GRANT SELECT ON public.credits TO authenticated;
GRANT ALL ON public.credits TO service_role;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_credits_updated_at
BEFORE UPDATE ON public.credits
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "credits_self_select" ON public.credits
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- credit_transactions
-- =========================================================
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID,
  type public.transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  stripe_session_id TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_credit_tx_user ON public.credit_transactions(user_id, created_at DESC);

CREATE POLICY "credit_tx_self_select" ON public.credit_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- teacher_availability (weekly recurring rules)
-- =========================================================
CREATE TABLE public.teacher_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sun ... 6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);
GRANT SELECT ON public.teacher_availability TO anon, authenticated;
GRANT ALL ON public.teacher_availability TO service_role;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_teacher_avail_updated_at
BEFORE UPDATE ON public.teacher_availability
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "availability_public_read" ON public.teacher_availability
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "availability_admin_write" ON public.teacher_availability
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- availability_exceptions (per-date overrides)
-- =========================================================
CREATE TABLE public.availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  blocked BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (blocked = true) OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);
GRANT SELECT ON public.availability_exceptions TO anon, authenticated;
GRANT ALL ON public.availability_exceptions TO service_role;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "avail_exc_public_read" ON public.availability_exceptions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "avail_exc_admin_write" ON public.availability_exceptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- lessons
-- =========================================================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL UNIQUE,
  duration_min INTEGER NOT NULL DEFAULT 50,
  mode public.game_mode NOT NULL,
  status public.lesson_status NOT NULL DEFAULT 'scheduled',
  meet_url TEXT,
  feedback TEXT,
  vocabulary_notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by public.cancelled_by_actor,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_lessons_student_date ON public.lessons(student_id, scheduled_at DESC);
CREATE INDEX idx_lessons_scheduled_at ON public.lessons(scheduled_at);

CREATE TRIGGER trg_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FK for credit_transactions.lesson_id (after lessons exists)
ALTER TABLE public.credit_transactions
  ADD CONSTRAINT credit_tx_lesson_fk
  FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL;

CREATE POLICY "lessons_self_or_admin_select" ON public.lessons
  FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(), 'admin'));

-- Direct writes are locked; all mutations go through SECURITY DEFINER RPC or server functions.
-- Admin can update meet_url / feedback / vocabulary_notes through server fns (uses service_role or admin path).

-- =========================================================
-- Auth trigger: bootstrap profile + credits on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.credits (user_id, balance, reserved)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
