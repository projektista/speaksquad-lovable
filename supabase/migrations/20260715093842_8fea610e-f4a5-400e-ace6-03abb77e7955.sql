-- Overhaul credits: replace scalar balance with per-credit lots that expire.

-- 1. New enums
DO $$ BEGIN
  CREATE TYPE public.credit_lot_status AS ENUM ('available','reserved','consumed','expired','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.credit_package_code AS ENUM ('single','pack5','pack10');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.purchase_status AS ENUM ('pending','paid','refunded','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend transaction_type with new values (idempotent)
DO $$ BEGIN
  ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'consumption';
EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'expiration';
EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE public.transaction_type ADD VALUE IF NOT EXISTS 'extension';
EXCEPTION WHEN undefined_object THEN NULL; END $$;

-- 2. credit_purchases
CREATE TABLE IF NOT EXISTS public.credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  package_code public.credit_package_code NOT NULL,
  credits INT NOT NULL CHECK (credits > 0),
  amount_jpy INT NOT NULL CHECK (amount_jpy >= 0),
  expiry_days INT NOT NULL CHECK (expiry_days > 0),
  status public.purchase_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.credit_purchases TO authenticated;
GRANT ALL ON public.credit_purchases TO service_role;
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own purchases read" ON public.credit_purchases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin manage purchases" ON public.credit_purchases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_credit_purchases_updated
  BEFORE UPDATE ON public.credit_purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_credit_purchases_user ON public.credit_purchases(user_id);

-- 3. credit_lots (one row per credit unit)
CREATE TABLE IF NOT EXISTS public.credit_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  purchase_id UUID REFERENCES public.credit_purchases(id) ON DELETE SET NULL,
  status public.credit_lot_status NOT NULL DEFAULT 'available',
  expires_at TIMESTAMPTZ NOT NULL,
  reserved_for_lesson_id UUID,
  consumed_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'purchase',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.credit_lots TO authenticated;
GRANT ALL ON public.credit_lots TO service_role;
ALTER TABLE public.credit_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own lots read" ON public.credit_lots
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "admin manage lots" ON public.credit_lots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_credit_lots_updated
  BEFORE UPDATE ON public.credit_lots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_credit_lots_fifo
  ON public.credit_lots(user_id, expires_at)
  WHERE status = 'available';

CREATE INDEX idx_credit_lots_reserved_lesson
  ON public.credit_lots(reserved_for_lesson_id)
  WHERE status = 'reserved';

CREATE INDEX idx_credit_lots_expiration_scan
  ON public.credit_lots(expires_at)
  WHERE status IN ('available','reserved');

-- 4. Summary view (available/reserved/next expiration)
CREATE OR REPLACE VIEW public.v_user_credit_summary
WITH (security_invoker = true)
AS
SELECT
  u.id AS user_id,
  COALESCE(SUM(CASE WHEN cl.status='available' THEN 1 ELSE 0 END),0)::INT AS available,
  COALESCE(SUM(CASE WHEN cl.status='reserved'  THEN 1 ELSE 0 END),0)::INT AS reserved,
  MIN(CASE WHEN cl.status='available' THEN cl.expires_at END) AS next_expiration
FROM auth.users u
LEFT JOIN public.credit_lots cl ON cl.user_id = u.id
GROUP BY u.id;

GRANT SELECT ON public.v_user_credit_summary TO authenticated;

-- 5. Migrate existing balances from `credits` into starter lots (60d default) then drop
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT user_id, balance FROM public.credits WHERE balance > 0 LOOP
    INSERT INTO public.credit_lots (user_id, expires_at, source, note)
    SELECT r.user_id, now() + interval '60 days', 'migration', 'migrated from credits.balance'
    FROM generate_series(1, r.balance);
  END LOOP;
END $$;

DROP TABLE IF EXISTS public.credits;

-- 6. handle_new_user: stop inserting into credits (table gone)
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

  RETURN NEW;
END;
$$;

-- 7. Atomic booking helpers (SECURITY DEFINER)

-- Reserve the credit lot that expires soonest, mark it for a lesson.
CREATE OR REPLACE FUNCTION public.reserve_credit_lot(_user_id UUID, _lesson_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE lot_id UUID;
BEGIN
  SELECT id INTO lot_id
  FROM public.credit_lots
  WHERE user_id = _user_id AND status = 'available' AND expires_at > now()
  ORDER BY expires_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF lot_id IS NULL THEN
    RAISE EXCEPTION 'NO_CREDITS_AVAILABLE';
  END IF;

  UPDATE public.credit_lots
  SET status='reserved', reserved_for_lesson_id=_lesson_id
  WHERE id = lot_id;

  RETURN lot_id;
END;
$$;

-- Release a reserved lot (student cancel >=6h). Restore original expiration.
CREATE OR REPLACE FUNCTION public.release_credit_lot(_lesson_id UUID, _extend_days INT DEFAULT 0)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE lot_id UUID;
BEGIN
  UPDATE public.credit_lots
  SET status='available',
      reserved_for_lesson_id=NULL,
      expires_at = CASE
        WHEN _extend_days > 0 THEN GREATEST(expires_at, now() + make_interval(days => _extend_days))
        ELSE expires_at
      END
  WHERE reserved_for_lesson_id = _lesson_id AND status='reserved'
  RETURNING id INTO lot_id;

  RETURN lot_id;
END;
$$;

-- Consume the reserved lot (late cancel, no-show, completed).
CREATE OR REPLACE FUNCTION public.consume_credit_lot(_lesson_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE lot_id UUID;
BEGIN
  UPDATE public.credit_lots
  SET status='consumed', consumed_at=now()
  WHERE reserved_for_lesson_id = _lesson_id AND status='reserved'
  RETURNING id INTO lot_id;

  RETURN lot_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_credit_lot(UUID,UUID) FROM public;
REVOKE ALL ON FUNCTION public.release_credit_lot(UUID,INT) FROM public;
REVOKE ALL ON FUNCTION public.consume_credit_lot(UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.reserve_credit_lot(UUID,UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.release_credit_lot(UUID,INT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.consume_credit_lot(UUID) TO authenticated, service_role;
