import { Request, Response } from "express";
import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register"
import { ParamsType } from "../../types/express/express"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";
import { signInService, signUpService } from "../../service/auth/authService";

// =======================================
// Crea Usurio
// =======================================
export const signUpController = {
  Credentials: async (req: Request, res: Response) => {
    try {
      const { name, email, password, rolID } = req.body;

      if (!name || !email || !password) {
        return response.error(
          res,
          ErrorCode.MISSING_PARAMS,
          'Todos los campos son requeridos',
          400
        );
      }

      const data: UserRegisterProps = { name, email, password, rolID };

      const result = await signUpService.Credentials(data);

      return response.success(
        res,
        SuccessCode.SUCCESS,
        result?.message || 'Usuario registrado correctamente',
        null,
        200
      )

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      console.error('Controller Error:', message);
      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        message,
        500
      );
    }
  },
  Google: async (req: Request, res: Response) => {
    try {
      const { name, email, imageUrl, authID  } = req.body;

      if ( !name || !email || !imageUrl || !authID) {
        return response.error(
          res,
          ErrorCode.MISSING_PARAMS,
          'Todos los campos son requeridos',
          400
        );
      }

      const data: UserRegisterGoogleProps = { name, email, imageUrl, authID };

      const result = await signUpService.Google(data);
     

        return response.success(
        res,
        SuccessCode.SUCCESS,
        result?.message || 'Usuario registrado correctamente',
        null,
        200
      );


    } catch (error) {
      console.error('Controller Error:', error);
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        message,
        500
      );
    }

  }
}