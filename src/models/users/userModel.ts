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
    const updated = await prisma.users.update({
      where: { id },
      data: {
        ...(data.username !== undefined ? { username: data.username } : {}),
        ...(data.alias !== undefined ? { alias: data.alias } : {}),
        ...(data.imageUrl !== undefined ? { image_url: data.imageUrl } : {}),
        updated_at: new Date(),
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
    });

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
