-- ============================================================================
-- sp_registeruser
-- Snapshot tal cual existe HOY en arche_dev (schema public).
--
-- ADVERTENCIA: este procedure está roto respecto a la tabla "users" actual.
-- Fue escrito para un esquema anterior con columnas en mayúsculas
-- ("EMAIL", "AUTH_ID", "NAME", "PASSWORD", "ROL_ID", "IMAGE_URL", "USER_ID"),
-- pero la tabla "users" real ya usa columnas en minúscula
-- (email, auth_id, username, password_hash, rol_id, image_url, id).
-- Si se ejecuta un CALL sp_registeruser(...) tal cual, Postgres fallará con
-- "column ... does not exist".
--
-- Por eso la API (src/models/auth/authModel.ts) nunca llamó a este procedure:
-- el registro de usuarios usa la función sql/functions/auth/ft_register_user.sql
-- (FUNCTION, no PROCEDURE, adaptada a las columnas reales en minúscula).
-- Este archivo queda como referencia/backup histórico de lo que hubo en la BD.
-- ============================================================================

CREATE OR REPLACE PROCEDURE public.sp_registeruser(
    IN p_name character varying,
    IN p_email character varying,
    IN p_password character varying,
    IN p_rol_id integer,
    IN p_image_url text DEFAULT NULL::text,
    IN p_auth_id text DEFAULT NULL::text,
    IN p_type_auth character varying DEFAULT 'CREDENTIALS'::character varying
)
LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Verificar si el email ya existe
    IF EXISTS (SELECT 1 FROM users WHERE "EMAIL" = p_email) THEN
        RAISE EXCEPTION 'El email % ya está registrado', p_email USING ERRCODE = 'P0001';
    END IF;

    -- Verificar si ya existe un usuario con el mismo AUTH_ID (para autenticación externa)
    IF p_auth_id IS NOT NULL AND p_type_auth != 'CREDENTIALS' THEN
        IF EXISTS (SELECT 1 FROM users WHERE "AUTH_ID" = p_auth_id AND "TYPE_AUTH" = p_type_auth) THEN
            RAISE EXCEPTION 'El usuario ya está registrado con este proveedor' USING ERRCODE = 'P0001';
        END IF;
    END IF;

    -- Insertar usuario
    INSERT INTO users ("NAME", "EMAIL", "PASSWORD", "ROL_ID", "IMAGE_URL", "AUTH_ID", "TYPE_AUTH")
    VALUES (TRIM(p_name), TRIM(LOWER(p_email)), p_password, p_rol_id, p_image_url, p_auth_id, p_type_auth)
    RETURNING "USER_ID" INTO v_user_id;

    -- Retornar información mediante RAISE NOTICE (procedures no pueden RETURN valor)
    RAISE NOTICE 'Usuario registrado exitosamente con ID: %', v_user_id;
    RAISE NOTICE 'REGISTRATION_SUCCESS: Email: %, Rol: %', p_email, p_rol_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al registrar usuario. Detalle: %', SQLERRM USING ERRCODE = SQLSTATE;
END;
$procedure$;
