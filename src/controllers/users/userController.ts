// src/controllers/users/userController.ts
import { NextFunction, Request, Response } from "express";
import { UserFilters } from "../../types/users/user"
import { getUserService, updateUserService } from "../../service/users/userService"
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";
import { sessionService } from "../../service/sessions/sessionService";


export const userController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, isActive, rolId } = req.query;

    const filters: UserFilters = {
      name: (name as string) ?? null,
      isActive: isActive !== undefined ? isActive === 'true' : null,
      rolId: rolId !== undefined ? Number(rolId) : null
    };

    const users = await getUserService(filters);

    if (users.length === 0) {
      return response.success(
        res,
        SuccessCode.EMPTY,
        'No hay usuarios',
        [],
        204
      );
    }

    return response.success(
      res,
      SuccessCode.LIST_FETCHED,
      'Usuarios obtenidos',
      users
    );

  } catch (error) {
    next(error);
  }
};


export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID de usuario inválido', 400);
    }

    const { username, alias, imageUrl } = req.body;

    const updated = await updateUserService(id, { username, alias, imageUrl });

    return response.success(
      res,
      SuccessCode.UPDATED,
      'Usuario actualizado correctamente',
      updated
    );

  } catch (error) {
    next(error);
  }
};


export const logoutAllDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId)

    if (!Number.isInteger(userId) || userId <= 0) {
      return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID de usuario inválido', 400);
    }

    await sessionService.closeAllByUser(userId)

    return response.success(
      res,
      SuccessCode.UPDATED,
      'Sesiones cerradas correctamente',
      null
    )
  } catch (error) {
    next(error)
  }
}
