import { pool } from "../../config/conexion";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import bcrypt from "bcryptjs";
import { UserSignIn, UserSignInGoogle, UserSignInGoogleResponse } from "../../types/users/user";
import { ErrorCode, ValidationErrorCode } from "../../constants/errorCodes";
import { SuccessCode } from "../../constants/successCodes";

// ====================================
// Inicia Sesión
// ====================================
export const signInModel = {
  Credentials: async (data: UserRegisterProps): Promise<SpResult<UserSignIn>> => {
    try {
      const { email, password } = data;

      // Buscar usuario por email
      const query = `
        SELECT "ID", "NAME", "EMAIL", "PASSWORD", "IMAGE_URL" 
        FROM "USERS" 
        WHERE "EMAIL" = $1 
        AND "IS_ACTIVE" = true 
        AND "TYPE_AUTH" = 'CREDENTIALS' 
        `;

      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        return {
          ok: true,
          code: SuccessCode.SUCCESS,
          message: 'Usuario no encontrado',
          data: [],
        };
      }

      const { PASSWORD, ...user } = result.rows[0];


      // Comparar contraseña ingresada con el hash almacenado
      const isMatch: boolean = await bcrypt.compare(password!, PASSWORD);

      if (!isMatch) {
        return {
          ok: true,
          code: ValidationErrorCode.INVALID_PASSWORD,
          message: 'Contraseña incorrecta',
          data: [],
        };
      }
      return {
        ok: true,
        message: 'Inicio de sesión exitoso',
        code: SuccessCode.SUCCESS,
        data: user
      };

    } catch (error) {
      console.error('Error en signInModel.Credentials:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión'
      );
    }
  },
  Google: async (data: UserSignInGoogle): Promise<UserSignInGoogleResponse> => {
    try {
      const { email, authID } = data;


      const query = `
        SELECT "ID" as id, "NAME" as name, "EMAIL" as email, "IMAGE_URL" as imageUrl, "TYPE_AUTH" as typeAuth
        FROM "USERS"
        WHERE "EMAIL" = $1 
        AND "AUTH_ID" = $2 
        AND "IS_ACTIVE" = true 
        AND "TYPE_AUTH" = 'GOOGLE' 
        `;
      const values = [email, authID];

      const result = await pool.query(query, values);

      const user = result.rows[0];
      return user

    } catch (error: unknown) {
      console.error('Error en signInModel.Google:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(message);
    }
  }
}

// ====================================
// Crea Usurio
// ====================================
export const signUpModel = {
  Credentials: async (data: UserRegisterProps): Promise<any> => {
    try {
      const { name, email, password, rolID } = data;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password!, salt);

      const query = 'CALL sp_registerUser($1, $2, $3, $4, $5, $6, $7)';
      const values = [name, email, hashedPassword, rolID, 'HTTP://localhost:5173', null, 'CREDENTIALS'];

      const result = await pool.query(query, values);

      const response: SpResultBasic | undefined = result.rows[0];


      return response

    } catch (error) {
      console.error('Error en postSignUpCredentialsModel:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario'
      );
    }
  },
  Google: async (data: UserRegisterGoogleProps): Promise<any> => {

    try {
      const { name, email, imageUrl, authID } = data;

      const query = 'CALL sp_registerUser($1, $2, $3, $4, $5, $6, $7) ';
      const values = [name, email, null, null, imageUrl, authID, 'GOOGLE'];

      const result = await pool.query(query, values);

      const response: SpResultBasic | undefined = result.rows[0];

      return response

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      console.log(message);

      throw new Error(
        error instanceof Error ? error.message : 'Error al registrar usuario'
      );
    }
  }
}
