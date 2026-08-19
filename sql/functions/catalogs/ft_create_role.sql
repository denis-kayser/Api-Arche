-- ============================================================================
-- ft_create_role
-- Reemplaza a prisma.roles.create() en roleModel.create
-- (src/models/catalogs/catalogModel.ts). created_at usa el DEFAULT now()
-- de la tabla (misma zona horaria que la sesión de Postgres).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_create_role(
    p_description varchar
)
RETURNS SETOF roles
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO roles (description)
    VALUES (TRIM(p_description))
    RETURNING *;
END;
$function$;
