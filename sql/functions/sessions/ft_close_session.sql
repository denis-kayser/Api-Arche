-- ============================================================================
-- ft_close_session
-- Reemplaza a prisma.sessions.updateMany() en closeSessionModel
-- (src/models/sessions/sessionModel.ts), llamado al desconectar el socket.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_close_session(
    p_socket_id varchar
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE sessions
    SET is_active = false, last_seen_at = now()
    WHERE socket_id = p_socket_id AND is_active = true;
END;
$function$;
