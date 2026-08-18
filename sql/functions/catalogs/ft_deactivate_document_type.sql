-- ============================================================================
-- ft_deactivate_document_type
-- Reemplaza a prisma.document_types.update() en documentTypeModel.softDelete
-- (src/models/catalogs/catalogModel.ts).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_deactivate_document_type(
    p_id integer
)
RETURNS SETOF document_types
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE document_types
    SET is_active = false, updated_at = now()
    WHERE id = p_id
    RETURNING *;
END;
$function$;
