import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { signInModel, signUpModel } from "../../models/auth/authModel";
import { UserSignIn } from "../../types/users/user";

// =======================================
// Inicia Sesión
// =======================================
export const signInService = {
  Credentials: async (data: UserRegisterProps): Promise<SpResult<UserSignIn>> => {
    try {
      const response = await signInModel.Credentials(data);

      return response

    } catch (error) {
      console.error('Service Error:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al iniciar sesión'
      );
    }
  },
  Google: async (data: UserRegisterProps): Promise<SpResultBasic> => {
    try {
      const response = await signInModel.Google(data);

      return response

    } catch (error) {
      console.error('Service Error:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario'
      );
    }
  }
}


// =======================================
// Crea Usurio
// =======================================
export const signUpService = {
  Credentials: async (data: UserRegisterProps): Promise<SpResultBasic> => {
    try {
      const response = await signUpModel.Credentials(data);

      return response

    } catch (error) {
      console.error('Service Error:', error);

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario'
      );
    }
  },
  Google: async (data: UserRegisterGoogleProps): Promise<SpResultBasic> => {
    try {
      const response = await signUpModel.Google(data);

      return response

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      console.log(message);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al registrar usuario'
      );
    }
  }
}