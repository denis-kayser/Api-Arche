import { Request, Response } from "express";
import { response } from "../../util/response";
import { ErrorCode } from "../../constants/errorCodes";
import { moduleService } from "../../service/module/moduleService";
import { getDatabaseErrorCode, getDatabaseErrorMessage, isDatabaseError } from '../../util/errors';
import { SuccessCode } from "../../constants/successCodes";



export const moduleController = {
  getAllModule: async (req: Request, res: Response) => {
    try {
      const result = await moduleService.getAllModule();

      return response.success(
        res,
        SuccessCode.SUCCESS,
        result.message,
        result.data,
        200
      )

    } catch (error) {

      const message = error instanceof Error ? error.message : 'Error al obtener los módulos';
      if (isDatabaseError(error)) {
        const dbErrorCode = getDatabaseErrorCode(error);
        const userMessage = getDatabaseErrorMessage(dbErrorCode);
        return response.error(
          res,
          dbErrorCode,
          userMessage,
          503
        );
      }

      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        message,
        500
      );
    }

  }
}



