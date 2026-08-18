-- ============================================================================
-- ft_close_all_sessions_by_user
-- Reemplaza a prisma.sessions.updateMany() en closeAllSessionsByUserModel
-- (src/models/sessions/sessionModel.ts), usado además del kick en vivo por
-- socket para cerrar en BD todas las sesiones activas de un usuario.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_close_all_sessions_by_user(
    p_user_id integer
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE sessions
    SET is_active = false, last_seen_at = now()
    WHERE user_id = p_user_id AND is_active = true;
END;
$function$;
