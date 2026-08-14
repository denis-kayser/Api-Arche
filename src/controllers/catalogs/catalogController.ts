import { NextFunction, Request, Response } from "express";
import { response } from "../../util/response";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";
import { documentTypeService, roleService, permissionService } from "../../service/catalogs/catalogService";

const parseId = (raw: string | string[] | undefined) => {
  const id = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// ====================================
// Tipos de documento
// ====================================
export const documentTypeController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await documentTypeService.getAll();
      return response.success(res, SuccessCode.LIST_FETCHED, 'Tipos de documento obtenidos', data);
    } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, abbreviation } = req.body;
      const data = await documentTypeService.create({ name, abbreviation });
      return response.success(res, SuccessCode.CREATED, 'Tipo de documento creado correctamente', data, 201);
    } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const { name, abbreviation, isActive } = req.body;
      const data = await documentTypeService.update(id, { name, abbreviation, isActive });
      return response.success(res, SuccessCode.UPDATED, 'Tipo de documento actualizado correctamente', data);
    } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const data = await documentTypeService.softDelete(id);
      return response.success(res, SuccessCode.DELETED, 'Tipo de documento desactivado correctamente', data);
    } catch (error) { next(error); }
  },
}

// ====================================
// Roles
// ====================================
export const roleController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await roleService.getAll();
      return response.success(res, SuccessCode.LIST_FETCHED, 'Roles obtenidos', data);
    } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description } = req.body;
      const data = await roleService.create({ description });
      return response.success(res, SuccessCode.CREATED, 'Rol creado correctamente', data, 201);
    } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const { description, isActive } = req.body;
      const data = await roleService.update(id, { description, isActive });
      return response.success(res, SuccessCode.UPDATED, 'Rol actualizado correctamente', data);
    } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const data = await roleService.softDelete(id);
      return response.success(res, SuccessCode.DELETED, 'Rol desactivado correctamente', data);
    } catch (error) { next(error); }
  },
}

// ====================================
// Permisos
// ====================================
export const permissionController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await permissionService.getAll();
      return response.success(res, SuccessCode.LIST_FETCHED, 'Permisos obtenidos', data);
    } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name } = req.body;
      const data = await permissionService.create({ id, name });
      return response.success(res, SuccessCode.CREATED, 'Permiso creado correctamente', data, 201);
    } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const { name, isActive } = req.body;
      const data = await permissionService.update(id, { name, isActive });
      return response.success(res, SuccessCode.UPDATED, 'Permiso actualizado correctamente', data);
    } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (!id) return response.error(res, ErrorCode.VALIDATION_ERROR, 'ID inválido', 400);
      const data = await permissionService.softDelete(id);
      return response.success(res, SuccessCode.DELETED, 'Permiso desactivado correctamente', data);
    } catch (error) { next(error); }
  },
}
