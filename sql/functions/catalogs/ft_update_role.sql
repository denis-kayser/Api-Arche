-- ============================================================================
-- ft_update_role
-- Reemplaza a prisma.roles.update() en roleModel.update
-- (src/models/catalogs/catalogModel.ts). Ojo: la columna real en la tabla
-- "roles" es "updated_At" (con mayúscula), por eso va citada; sin las
-- comillas Postgres la buscaría en minúscula y fallaría con
-- "column updated_at does not exist".
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_update_role(
    p_id          integer,
    p_description varchar  DEFAULT NULL,
    p_is_active   boolean  DEFAULT NULL
)
RETURNS SETOF roles
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE roles
    SET
        description  = COALESCE(p_description, description),
        is_active    = COALESCE(p_is_active, is_active),
        "updated_At" = now()
    WHERE id = p_id
    RETURNING *;
END;
$function$;
