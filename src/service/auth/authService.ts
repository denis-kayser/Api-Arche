import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { signInModel, signUpModel } from "../../models/auth/authModel";
import { UserSignIn, UserSignInGoogle, UserSignInGoogleResponse } from "../../types/users/user";
import { ErrorCode } from "../../constants/errorCodes";

// =======================================
// Inicia Sesión
// =======================================
export const signInService = {
  Credentials: async (data: UserRegisterProps): Promise<SpResult<UserSignIn>> => {
    return signInModel.Credentials(data);
  },
  Google: async (data: UserSignInGoogle): Promise<UserSignInGoogleResponse> => {
    const user = await signInModel.Google(data);

    if (!user) {
      const error: Error & { code?: ErrorCode } = new Error('Usuario no encontrado');
      error.code = ErrorCode.USER_NOT_FOUND;
      throw error;
    }

    return user
  }
}

// =======================================
// Crea Usurio
// =======================================
export const signUpService = {
  Credentials: async (data: UserRegisterProps): Promise<SpResultBasic> => {
    return signUpModel.Credentials(data);
  },
  Google: async (data: UserRegisterGoogleProps): Promise<SpResultBasic> => {
    return signUpModel.Google(data);
  }
}
