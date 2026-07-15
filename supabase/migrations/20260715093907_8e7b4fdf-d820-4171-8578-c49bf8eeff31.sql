REVOKE EXECUTE ON FUNCTION public.reserve_credit_lot(UUID,UUID) FROM authenticated, anon, public;
REVOKE EXECUTE ON FUNCTION public.release_credit_lot(UUID,INT) FROM authenticated, anon, public;
REVOKE EXECUTE ON FUNCTION public.consume_credit_lot(UUID) FROM authenticated, anon, public;
GRANT EXECUTE ON FUNCTION public.reserve_credit_lot(UUID,UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_credit_lot(UUID,INT) TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_credit_lot(UUID) TO service_role;