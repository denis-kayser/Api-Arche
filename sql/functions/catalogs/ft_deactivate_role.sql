-- ============================================================================
-- ft_deactivate_role
-- Reemplaza a prisma.roles.update() en roleModel.softDelete
-- (src/models/catalogs/catalogModel.ts). Ver ft_update_role.sql sobre la
-- columna "updated_At" citada.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_deactivate_role(
    p_id integer
)
RETURNS SETOF roles
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE roles
    SET is_active = false, "updated_At" = now()
    WHERE id = p_id
    RETURNING *;
END;
$function$;
