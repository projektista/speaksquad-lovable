-- Fix: "permission denied for table profiles" (and every other public table).
--
-- Root cause: RLS policies were created, but no table-level GRANTs were ever
-- issued to the PostgREST roles. In current Supabase projects the `public`
-- schema no longer grants default privileges to `anon` / `authenticated` /
-- `service_role`, so PostgREST rejects the request BEFORE RLS is evaluated:
--   -> ERROR: permission denied for table profiles
-- RLS policies are necessary but NOT sufficient; both layers must allow the call.
--
-- Symptom mapping:
--   * getMyProfile()  -> SELECT denied  -> form renders empty
--   * updateMyProfile -> UPDATE denied  -> "permission denied for table profiles"
--   * getProfileCompletion() -> SELECT denied -> birth_date reads as null -> endless
--                               redirect to /complete-profile
--
-- Apply in the Supabase SQL Editor (or via CLI) against the standalone project.

-- Schema usage (safe to re-run).
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- User-owned tables: auth-only, every policy scopes to auth.uid(). No anon.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_lots TO authenticated;
GRANT ALL ON public.credit_lots TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_availability_slots TO authenticated;
GRANT ALL ON public.teacher_availability_slots TO service_role;

-- Views used by the app (security_invoker views still need grants).
GRANT SELECT ON public.v_user_credit_summary TO authenticated;
GRANT ALL ON public.v_user_credit_summary TO service_role;

-- Lesson chat / messages table, if present in this project.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'public' AND c.relname = 'lesson_messages') THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_messages TO authenticated';
    EXECUTE 'GRANT ALL ON public.lesson_messages TO service_role';
  END IF;
END $$;

-- RPCs called from server functions.
GRANT EXECUTE ON FUNCTION public.reserve_credit_lot(uuid, uuid) TO authenticated, service_role;

-- Safety net: any public table that still has no privileges for the PostgREST
-- roles gets the standard set. Does not touch tables where grants already exist.
DO $$
DECLARE tbl record; has_priv boolean;
BEGIN
  FOR tbl IN
    SELECT c.relname AS table_name
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE c.relkind IN ('r','v') AND n.nspname = 'public'
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
       WHERE grantee = 'authenticated' AND table_schema = 'public'
         AND table_name = tbl.table_name
         AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE')
    ) INTO has_priv;
    IF NOT has_priv THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl.table_name);
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
       WHERE grantee = 'service_role' AND table_schema = 'public'
         AND table_name = tbl.table_name
         AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE')
    ) INTO has_priv;
    IF NOT has_priv THEN
      EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl.table_name);
    END IF;
  END LOOP;
END $$;

-- Future tables created by the migration owner inherit these privileges.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
