import { prisma } from "../../config/prisma";
import { User, UserFilters, UpdateUserProps } from "../../types/users/user";

export const getUserhModel = async (filters: UserFilters): Promise<User[]> => {
  try {
    const { name, isActive, rolId } = filters;

    const users = await prisma.users.findMany({
      where: {
        ...(name ? {
          OR: [
            { username: { contains: name, mode: 'insensitive' } },
            { alias: { contains: name, mode: 'insensitive' } },
          ]
        } : {}),
        ...(isActive !== null && isActive !== undefined ? { is_active: isActive } : {}),
        ...(rolId !== null && rolId !== undefined ? { rol_id: rolId } : {}),
      },
      select: {
        id: true,
        username: true,
        rol_id: true,
        is_active: true,
        email: true,
        image_url: true,
        auth_id: true,
        type_auth: true,
      },
      orderBy: { id: 'asc' }
    });

    return users.map((user) => ({
      id: user.id,
      name: user.username ?? '',
      rolId: user.rol_id,
      isActive: user.is_active,
      email: user.email,
      imageUrl: user.image_url,
      authID: user.auth_id,
      typeAuth: user.type_auth,
    }));

  } catch (error) {
    console.error('Error en getUserhModel:', error);

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Error al obtener la información'
    );
  }
};

export const updateUserModel = async (id: number, data: UpdateUserProps): Promise<User> => {
  try {
    const rows = await prisma.$queryRaw<{
      id: number;
      username: string | null;
      rol_id: number | null;
      is_active: boolean;
      email: string;
      image_url: string | null;
      auth_id: string | null;
      type_auth: string;
    }[]>`
      SELECT id, username, rol_id, is_active, email, image_url, auth_id, type_auth
      FROM ft_update_user(
        ${id}::integer,
        ${data.username ?? null}::varchar,
        ${data.alias ?? null}::varchar,
        ${data.imageUrl ?? null}::text
      )
    `;

    const updated = rows[0];

    return {
      id: updated.id,
      name: updated.username ?? '',
      rolId: updated.rol_id,
      isActive: updated.is_active,
      email: updated.email,
      imageUrl: updated.image_url,
      authID: updated.auth_id,
      typeAuth: updated.type_auth,
    };

  } catch (error) {
    console.error('Error en updateUserModel:', error);
    throw error;
  }
};
