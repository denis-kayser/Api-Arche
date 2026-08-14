import { documentTypeModel, roleModel, permissionModel } from "../../models/catalogs/catalogModel";

export const documentTypeService = {
  getAll: () => documentTypeModel.getAll(),
  create: (data: { name: string; abbreviation?: string }) => documentTypeModel.create(data),
  update: (id: number, data: { name?: string; abbreviation?: string; isActive?: boolean }) => documentTypeModel.update(id, data),
  softDelete: (id: number) => documentTypeModel.softDelete(id),
}

export const roleService = {
  getAll: () => roleModel.getAll(),
  create: (data: { description: string }) => roleModel.create(data),
  update: (id: number, data: { description?: string; isActive?: boolean }) => roleModel.update(id, data),
  softDelete: (id: number) => roleModel.softDelete(id),
}

export const permissionService = {
  getAll: () => permissionModel.getAll(),
  create: (data: { id: number; name: string }) => permissionModel.create(data),
  update: (id: number, data: { name?: string; isActive?: boolean }) => permissionModel.update(id, data),
  softDelete: (id: number) => permissionModel.softDelete(id),
}
