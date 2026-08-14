-- ============================================================================
-- ft_register_user
-- Reemplazo (como FUNCTION, no PROCEDURE) del viejo sp_registeruser roto
-- (ver sql/procedures/sp_registeruser.sql). Adaptado a las columnas reales
-- actuales de "users" (minúscula): email, username, password_hash, rol_id,
-- image_url, auth_id, type_auth, is_active.
--
-- Por qué FUNCTION y no PROCEDURE:
--   - No necesita control transaccional propio (COMMIT/ROLLBACK internos).
--   - RETURNS SETOF users permite leer la fila insertada directo con
--     SELECT * FROM ft_register_user(...), consumible con Prisma $queryRaw
--     sin depender de parámetros OUT como exigía CALL sp_registeruser(...).
--
-- Nota: recibe la contraseña YA hasheada (p_password_hash). El hashing con
-- bcrypt sigue haciéndose en la app (bcryptjs), igual que hoy en
-- src/models/auth/authModel.ts — este function no reemplaza eso.
--
-- users.auth_id se migró de integer a varchar(255) (los ID de cuenta de
-- Google, claim "sub", tienen 18-21 dígitos y no entran ni en bigint de 64
-- bits) — este function ya trata p_auth_id como texto, sin castear a integer.
--
-- Estado: NO está conectado a la API todavía. src/models/auth/authModel.ts
-- usa Prisma ORM directo (prisma.users.create). Este archivo queda como
-- referencia/opción para quien quiera volver a mover esta lógica a la BD.
-- Para usarlo desde la API: prisma.$queryRaw`SELECT * FROM ft_register_user(...)`.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ft_register_user(
    p_name          varchar,
    p_email         varchar,
    p_password_hash varchar     DEFAULT NULL,
    p_rol_id        integer     DEFAULT NULL,
    p_image_url     text        DEFAULT NULL,
    p_auth_id       varchar     DEFAULT NULL,
    p_type_auth     varchar     DEFAULT 'CREDENTIALS'
)
RETURNS SETOF users
LANGUAGE plpgsql
AS $function$
DECLARE
    v_email   varchar := lower(trim(p_email));
    v_auth_id varchar := NULLIF(p_auth_id, '');
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = v_email) THEN
        RAISE EXCEPTION 'El email % ya está registrado', p_email USING ERRCODE = 'P0001';
    END IF;

    IF v_auth_id IS NOT NULL AND p_type_auth <> 'CREDENTIALS' THEN
        IF EXISTS (SELECT 1 FROM users WHERE auth_id = v_auth_id AND type_auth = p_type_auth) THEN
            RAISE EXCEPTION 'El usuario ya está registrado con este proveedor' USING ERRCODE = 'P0001';
        END IF;
    END IF;

    RETURN QUERY
    INSERT INTO users (username, email, password_hash, rol_id, image_url, auth_id, type_auth, is_active)
    VALUES (
        TRIM(p_name),
        v_email,
        p_password_hash,
        p_rol_id,
        p_image_url,
        v_auth_id,
        p_type_auth,
        true -- mismo criterio que hoy usa la API: activo desde el registro
    )
    RETURNING *;
END;
$function$;
