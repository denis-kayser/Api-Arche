-- ============================================================================
-- ft_update_user
-- Reemplaza a prisma.users.update() en updateUserModel
-- (src/models/users/userModel.ts). Los parámetros NULL no modifican la
-- columna correspondiente (COALESCE), igual que el spread condicional
-- que hacía el código TS con "!== undefined". updated_at usa el now() de
-- Postgres en vez del new Date() calculado en Node.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_update_user(
    p_id         integer,
    p_username   varchar DEFAULT NULL,
    p_alias      varchar DEFAULT NULL,
    p_image_url  text    DEFAULT NULL
)
RETURNS SETOF users
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE users
    SET
        username   = COALESCE(p_username, username),
        alias      = COALESCE(p_alias, alias),
        image_url  = COALESCE(p_image_url, image_url),
        updated_at = now()
    WHERE id = p_id
    RETURNING *;
END;
$function$;
