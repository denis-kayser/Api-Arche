import { NextFunction, Request, Response } from "express";
import { response } from "../../util/response";
import { moduleService } from "../../service/module/moduleService";
import { SuccessCode } from "../../constants/successCodes";


export const moduleController = {
  getAllModule: async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  }
}
