-- ============================================================================
-- ft_update_permission
-- Reemplaza a prisma.permissions.update() en permissionModel.update
-- (src/models/catalogs/catalogModel.ts). La tabla "permissions" no tiene
-- columnas created_at/updated_at, por eso no se tocan timestamps aquí.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_update_permission(
    p_id        integer,
    p_name      varchar  DEFAULT NULL,
    p_is_active boolean  DEFAULT NULL
)
RETURNS SETOF permissions
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE permissions
    SET
        name      = COALESCE(p_name, name),
        is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_id
    RETURNING *;
END;
$function$;
