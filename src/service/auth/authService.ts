import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { signInModel, signUpModel } from "../../models/auth/authModel";
import { UserSignIn, UserSignInGoogle, UserSignInGoogleResponse } from "../../types/users/user";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";
import { getErrorMessage } from "../../util/errors";

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
  Google: async (data: UserSignInGoogle): Promise<UserSignInGoogleResponse> => {
    try {

      const { email, authID } = data;

      if (!email || !email.includes('@')) {
        throw new Error('El email no es válido');
      }

      if (!authID || authID.trim().length === 0) {
        throw new Error('El authID es requerido');
      }

      if (!email || !authID) {
        throw new Error('Email y authID son requeridos');
      }

      const user = await signInModel.Google(data);

      if (!user) {
        throw new Error('usuario no encontrado');
      }

      return user
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(message);
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