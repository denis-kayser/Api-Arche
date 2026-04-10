import { Request, Response } from "express";
import { UserRegisterProps } from "../../types/users/register"
import { ParamsType } from "../../types/express/express"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode, ValidationErrorCode } from "../../constants/errorCodes";
import { signInService } from "../../service/auth/authService";
import { UserSignIn, UserSignInGoogle } from "../../types/users/user";


export const signInController = {
  Credentials: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(
          res,
          ErrorCode.MISSING_PARAMS,
          'Todos los campos son requeridos',
          400
        );
      }

      const data: UserRegisterProps = { email, password };

      const result = await signInService.Credentials(data);

      if (result.ok) {
        return response.error(
          res,
          ErrorCode.UNAUTHORIZED,
          result.message || 'Credenciales inválidas',
          401
        );
      }


      return response.success(
        res,
        SuccessCode.SUCCESS,
        result.message || 'Usuario logueado correctamente',
        result.data,
        200
      );

    } catch (error) {
      console.error('Controller Error:', error);

      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      );
    }

  },
  Google: async (req: Request, res: Response) => {
    try {
      const { email, authID } = req.body;

      if (!email || !authID) {
        return response.error(
          res,
          ErrorCode.MISSING_PARAMS,
          'Todos los campos son requeridos',
          400
        );
      }

      if (!email.includes('@')) {
        return response.error(
          res,
          ValidationErrorCode.INVALID_EMAIL,
          'El email no es válido',
          400
        );
      }

      const user: UserSignInGoogle = { email, authID };

      // servicio para verificar usuario
      const result = await signInService.Google(user);

      console.log(result);
      


      return response.success(
        res,
        SuccessCode.SUCCESS,
        'Usuario logueado correctamente',
        result,
        200
      );

    } catch (error) {
      console.error('Controller Error:', error);

      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      );
    }
  }
}