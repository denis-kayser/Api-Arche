import { NextFunction, Request, Response } from "express";
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";
import { sessionService } from "../../service/sessions/sessionService";

const parseId = (value: string | string[] | undefined): number | null => {
  if (typeof value !== 'string') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const sessionController = {
  // GET /sessions — sesiones activas visibles para quien pregunta (según su rol)
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessions = await sessionService.getAll(req.currentUser!.id);
      return response.success(res, SuccessCode.LIST_FETCHED, 'Sesiones obtenidas', sessions);
    } catch (error) {
      next(error);
    }
  },

  // GET /users/:id/sessions — sesiones activas de un usuario
  getByUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseId(req.params.id);

      if (userId === null) {
        return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID de usuario inválido', 400);
      }

      const sessions = await sessionService.getByUser(userId, req.currentUser!.id);
      return response.success(res, SuccessCode.LIST_FETCHED, 'Sesiones obtenidas', sessions);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /sessions/:id — cierra una sesión puntual (un dispositivo)
  close: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = parseId(req.params.id);

      if (sessionId === null) {
        return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID de sesión inválido', 400);
      }

      await sessionService.close(sessionId, req.currentUser!.id);
      return response.success(res, SuccessCode.SUCCESS, 'Sesión cerrada correctamente', null);
    } catch (error) {
      next(error);
    }
  },

  // POST /users/:id/sessions/close-all — cierra todas las sesiones de un usuario
  closeAllByUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseId(req.params.id);

      if (userId === null) {
        return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID de usuario inválido', 400);
      }

      await sessionService.closeAllByUser(userId, req.currentUser!.id);
      return response.success(res, SuccessCode.SUCCESS, 'Sesiones cerradas correctamente', null);
    } catch (error) {
      next(error);
    }
  },
};
