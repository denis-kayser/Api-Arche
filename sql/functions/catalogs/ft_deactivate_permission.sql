-- ============================================================================
-- ft_deactivate_permission
-- Reemplaza a prisma.permissions.update() en permissionModel.softDelete
-- (src/models/catalogs/catalogModel.ts).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_deactivate_permission(
    p_id integer
)
RETURNS SETOF permissions
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE permissions
    SET is_active = false
    WHERE id = p_id
    RETURNING *;
END;
$function$;
