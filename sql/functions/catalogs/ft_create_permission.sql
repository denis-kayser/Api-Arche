-- ============================================================================
-- ft_create_permission
-- Reemplaza a prisma.permissions.create() en permissionModel.create
-- (src/models/catalogs/catalogModel.ts). A diferencia de las otras tablas
-- de catálogo, "permissions.id" NO es autoincremental: el id lo define
-- quien llama (coincide con el comportamiento actual vía Prisma).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_create_permission(
    p_id   integer,
    p_name varchar
)
RETURNS SETOF permissions
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO permissions (id, name)
    VALUES (p_id, TRIM(p_name))
    RETURNING *;
END;
$function$;
