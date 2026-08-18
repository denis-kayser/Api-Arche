-- ============================================================================
-- ft_close_all_stale_sessions
-- Reemplaza a prisma.sessions.updateMany() en closeAllStaleSessionsModel
-- (src/models/sessions/sessionModel.ts). Se llama una sola vez al iniciar
-- el servidor: el store en memoria de sockets siempre arranca vacío, así
-- que cualquier sesión que haya quedado "is_active = true" de un arranque
-- anterior es necesariamente fantasma. Devuelve la cantidad de filas
-- afectadas, igual que hoy hace result.count con Prisma.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_close_all_stale_sessions()
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
    v_count integer;
BEGIN
    UPDATE sessions
    SET is_active = false, last_seen_at = now()
    WHERE is_active = true;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$function$;
