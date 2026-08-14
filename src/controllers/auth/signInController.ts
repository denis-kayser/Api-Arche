import { NextFunction, Request, Response } from "express";
import { UserRegisterProps } from "../../types/users/register"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { signInService } from "../../service/auth/authService";
import { UserSignInGoogle } from "../../types/users/user";


export const signInController = {
  Credentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const data: UserRegisterProps = { email, password };

      const result = await signInService.Credentials(data);

      return res.status(200).json({
        ok: result.ok,
        code: result.code,
        message: result.message || 'Usuario logueado correctamente',
        data: result.data
      })

    } catch (error) {
      next(error);
    }

  },
  Google: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, authID } = req.body;

      const user: UserSignInGoogle = { email, authID };

      const result = await signInService.Google(user);

      return response.success(
        res,
        SuccessCode.SUCCESS,
        'Usuario logueado correctamente',
        result,
        200
      );

    } catch (error) {
      next(error);
    }
  }
}
