import { prisma } from "../../config/prisma";

// ====================================
// Tipos de documento
// ====================================
export const documentTypeModel = {
  getAll: async () => {
    return prisma.document_types.findMany({ orderBy: { id: 'asc' } });
  },
  create: async (data: { name: string; abbreviation?: string }) => {
    return prisma.document_types.create({
      data: { name: data.name, abbreviation: data.abbreviation ?? null },
    });
  },
  update: async (id: number, data: { name?: string; abbreviation?: string; isActive?: boolean }) => {
    return prisma.document_types.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.abbreviation !== undefined ? { abbreviation: data.abbreviation } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {}),
        updated_at: new Date(),
      },
    });
  },
  softDelete: async (id: number) => {
    return prisma.document_types.update({
      where: { id },
      data: { is_active: false, updated_at: new Date() },
    });
  },
}

// ====================================
// Roles
// ====================================
export const roleModel = {
  getAll: async () => {
    return prisma.roles.findMany({ orderBy: { id: 'asc' } });
  },
  create: async (data: { description: string }) => {
    return prisma.roles.create({ data: { description: data.description } });
  },
  update: async (id: number, data: { description?: string; isActive?: boolean }) => {
    return prisma.roles.update({
      where: { id },
      data: {
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {}),
        updated_At: new Date(),
      },
    });
  },
  softDelete: async (id: number) => {
    return prisma.roles.update({
      where: { id },
      data: { is_active: false, updated_At: new Date() },
    });
  },
}

// ====================================
// Permisos
// ====================================
export const permissionModel = {
  getAll: async () => {
    return prisma.permissions.findMany({ orderBy: { id: 'asc' } });
  },
  create: async (data: { id: number; name: string }) => {
    return prisma.permissions.create({ data: { id: data.id, name: data.name } });
  },
  update: async (id: number, data: { name?: string; isActive?: boolean }) => {
    return prisma.permissions.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {}),
      },
    });
  },
  softDelete: async (id: number) => {
    return prisma.permissions.update({
      where: { id },
      data: { is_active: false },
    });
  },
}
