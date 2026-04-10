import { pool } from "../../config/conexion";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import bcrypt from "bcryptjs";
import { UserSignIn } from "../../types/users/user";

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

      const {PASSWORD,...user} = result.rows[0];

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Comparar contraseña ingresada con el hash almacenado
      const isMatch: boolean = await bcrypt.compare(password!, PASSWORD);

      if (!isMatch) {
        throw new Error('Contraseña incorrecta');
      }

      return {
        ok: true,
        message: 'Inicio de sesión exitoso',
        data: user,
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
  Google: async (data: UserRegisterProps): Promise<SpResultBasic> => {
    try {
      const { name, email, password, rolID } = data;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password!, salt);


      const query = 'SELECT sp_registeruser($1, $2, $3, $4) AS result';
      const values = [name, email, hashedPassword, rolID];

      const result = await pool.query(query, values);

      const response: SpResultBasic | undefined = result.rows[0]?.result;

      if (!response) {
        throw new Error('Respuesta vacía del procedimiento');
      }

      if (!response || !response.ok) {
        throw new Error(response?.message || 'Error al registrar usuario');
      }
      return response

    } catch (error) {
      console.error('Error en postSignUpCredentialsModel:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario'
      );
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
