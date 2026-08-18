import { prisma } from "../../config/prisma";
import { document_types, roles, permissions } from "@prisma/client";

// ====================================
// Tipos de documento
// ====================================
export const documentTypeModel = {
  getAll: async () => {
    return prisma.document_types.findMany({ orderBy: { id: 'asc' } });
  },
  create: async (data: { name: string; abbreviation?: string }) => {
    const rows = await prisma.$queryRaw<document_types[]>`
      SELECT * FROM ft_create_document_type(${data.name}::varchar, ${data.abbreviation ?? null}::varchar)
    `;
    return rows[0];
  },
  update: async (id: number, data: { name?: string; abbreviation?: string; isActive?: boolean }) => {
    const rows = await prisma.$queryRaw<document_types[]>`
      SELECT * FROM ft_update_document_type(
        ${id}::integer,
        ${data.name ?? null}::varchar,
        ${data.abbreviation ?? null}::varchar,
        ${data.isActive ?? null}::boolean
      )
    `;
    return rows[0];
  },
  softDelete: async (id: number) => {
    const rows = await prisma.$queryRaw<document_types[]>`
      SELECT * FROM ft_deactivate_document_type(${id}::integer)
    `;
    return rows[0];
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
    const rows = await prisma.$queryRaw<roles[]>`
      SELECT * FROM ft_create_role(${data.description}::varchar)
    `;
    return rows[0];
  },
  update: async (id: number, data: { description?: string; isActive?: boolean }) => {
    const rows = await prisma.$queryRaw<roles[]>`
      SELECT * FROM ft_update_role(
        ${id}::integer,
        ${data.description ?? null}::varchar,
        ${data.isActive ?? null}::boolean
      )
    `;
    return rows[0];
  },
  softDelete: async (id: number) => {
    const rows = await prisma.$queryRaw<roles[]>`
      SELECT * FROM ft_deactivate_role(${id}::integer)
    `;
    return rows[0];
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
    const rows = await prisma.$queryRaw<permissions[]>`
      SELECT * FROM ft_create_permission(${data.id}::integer, ${data.name}::varchar)
    `;
    return rows[0];
  },
  update: async (id: number, data: { name?: string; isActive?: boolean }) => {
    const rows = await prisma.$queryRaw<permissions[]>`
      SELECT * FROM ft_update_permission(
        ${id}::integer,
        ${data.name ?? null}::varchar,
        ${data.isActive ?? null}::boolean
      )
    `;
    return rows[0];
  },
  softDelete: async (id: number) => {
    const rows = await prisma.$queryRaw<permissions[]>`
      SELECT * FROM ft_deactivate_permission(${id}::integer)
    `;
    return rows[0];
  },
}
