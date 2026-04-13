import { Request, Response } from "express";
import { response } from "../../util/response";
import { ErrorCode } from "../../constants/errorCodes";
import { moduleService } from "../../service/module/moduleService";



export const moduleController = {
  getAllModule: async (req: Request, res: Response) => {
    try {
      const result = await moduleService.getAllModule();


      return res.status(200).json({
        ok: result.ok,
        code: result.code,
        message: result.message || 'Módulos obtenidos correctamente',
        data: result.data
      })

    } catch (error) {
      console.error('Controller Error:', error);

      return response.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error al obtener los módulos'
      );
    }

  }
}