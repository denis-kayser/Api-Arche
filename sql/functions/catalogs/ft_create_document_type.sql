-- ============================================================================
-- ft_create_document_type
-- Reemplaza a prisma.document_types.create() en documentTypeModel.create
-- (src/models/catalogs/catalogModel.ts). created_at usa el DEFAULT now()
-- de la tabla (misma zona horaria que la sesión de Postgres), evitando el
-- desfase de 5 horas que se daba al insertar fechas calculadas en Node.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_create_document_type(
    p_name         varchar,
    p_abbreviation varchar DEFAULT NULL
)
RETURNS SETOF document_types
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO document_types (name, abbreviation)
    VALUES (TRIM(p_name), NULLIF(TRIM(p_abbreviation), ''))
    RETURNING *;
END;
$function$;
