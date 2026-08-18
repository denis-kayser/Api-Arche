-- ============================================================================
-- ft_create_session
-- Reemplaza a prisma.sessions.create() en createSessionModel
-- (src/models/sessions/sessionModel.ts), llamado al conectar el socket.
-- created_at/last_seen_at usan el DEFAULT now() de la tabla.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_create_session(
    p_user_id    integer,
    p_socket_id  varchar,
    p_user_agent varchar DEFAULT NULL,
    p_ip_address varchar DEFAULT NULL
)
RETURNS SETOF sessions
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO sessions (user_id, socket_id, user_agent, ip_address, is_active)
    VALUES (p_user_id, p_socket_id, p_user_agent, p_ip_address, true)
    RETURNING *;
END;
$function$;
