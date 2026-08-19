-- ============================================================================
-- ft_update_document_type
-- Reemplaza a prisma.document_types.update() en documentTypeModel.update
-- (src/models/catalogs/catalogModel.ts). Los parámetros NULL no modifican
-- la columna correspondiente (COALESCE), igual que el spread condicional
-- que hacía el código TS con "!== undefined". updated_at usa el now() de
-- Postgres en vez del new Date() calculado en Node.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_update_document_type(
    p_id           integer,
    p_name         varchar  DEFAULT NULL,
    p_abbreviation varchar  DEFAULT NULL,
    p_is_active    boolean  DEFAULT NULL
)
RETURNS SETOF document_types
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE document_types
    SET
        name         = COALESCE(p_name, name),
        abbreviation = COALESCE(p_abbreviation, abbreviation),
        is_active    = COALESCE(p_is_active, is_active),
        updated_at   = now()
    WHERE id = p_id
    RETURNING *;
END;
$function$;
