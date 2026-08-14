import { NextFunction, Request, Response } from "express";
import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { signUpService } from "../../service/auth/authService";

// =======================================
// Crea Usurio
// =======================================
export const signUpController = {
  Credentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, rolID } = req.body;

      const data: UserRegisterProps = { name, email, password, rolID };

      const result = await signUpService.Credentials(data);

      return response.success(
        res,
        SuccessCode.SUCCESS,
        result?.message || 'Usuario registrado correctamente',
        null,
        201
      )

    } catch (error) {
      next(error);
    }
  },
  Google: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, imageUrl, authID } = req.body;

      const data: UserRegisterGoogleProps = { name, email, imageUrl, authID };

      const result = await signUpService.Google(data);

      return response.success(
        res,
        SuccessCode.SUCCESS,
        result?.message || 'Usuario registrado correctamente',
        null,
        201
      );

    } catch (error) {
      next(error);
    }
  }
}
