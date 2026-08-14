import { prisma } from "../../config/prisma";
import {
  closeAllSessionsByUserModel,
  closeSessionModel,
  getActiveSessionsModel,
  getAllActiveSessionsModel,
  getSessionByIdModel
} from "../../models/sessions/sessionModel";
import { UserSession } from "../../types/sessions/session";
import { disconnectAllSessions, disconnectOneSession } from "../socket/socketService";
import { ErrorCode } from "../../constants/errorCodes";
import { getRoleDescription, canManageRole } from "../../util/roleHierarchy";

const forbidden = (message: string): Error & { code?: ErrorCode } => {
  const error: Error & { code?: ErrorCode } = new Error(message);
  error.code = ErrorCode.FORBIDDEN;
  return error;
};

// Lanza si `requesterId` no puede ver/gestionar las sesiones de `targetUserId`
// (siempre se permite sobre uno mismo, sin importar el rol).
const assertCanManage = async (requesterId: number, targetUserId: number): Promise<void> => {
  if (requesterId === targetUserId) return;

  const [requesterRole, targetRole] = await Promise.all([
    getRoleDescription(requesterId),
    getRoleDescription(targetUserId),
  ]);

  if (!canManageRole(requesterRole, targetRole)) {
    throw forbidden('No tienes permisos para gestionar las sesiones de este usuario');
  }
};

export const sessionService = {
  // Todas las sesiones activas del sistema, filtradas según el rol de quien pregunta:
  // - SUPER ADMIN ve todo.
  // - ADMIN / SOPORTE ven todo excepto sesiones de otros ADMIN/SOPORTE/SUPER ADMIN.
  // - Cualquier otro usuario solo ve las suyas.
  getAll: async (requesterId: number): Promise<UserSession[]> => {
    const [allSessions, requesterRole] = await Promise.all([
      getAllActiveSessionsModel(),
      getRoleDescription(requesterId),
    ]);

    if (requesterRole === 'SUPER ADMIN') {
      return allSessions;
    }

    const userIds = Array.from(new Set(allSessions.map((s) => s.userId)));
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, roles: { select: { description: true } } },
    });
    const roleByUserId = new Map(users.map((u) => [u.id, (u.roles?.description ?? '').toUpperCase()]));

    return allSessions.filter((s) =>
      s.userId === requesterId || canManageRole(requesterRole, roleByUserId.get(s.userId) ?? '')
    );
  },

  // Sesiones activas de un usuario puntual (para que el frontend muestre sus dispositivos).
  getByUser: async (userId: number, requesterId: number): Promise<UserSession[]> => {
    await assertCanManage(requesterId, userId);
    return getActiveSessionsModel(userId);
  },

  // Cierra una sesión puntual (un dispositivo) por su id.
  close: async (sessionId: number, requesterId: number): Promise<void> => {
    const session = await getSessionByIdModel(sessionId);

    if (!session) {
      const error: Error & { code?: ErrorCode } = new Error('Sesión no encontrada');
      error.code = ErrorCode.RESOURCE_NOT_FOUND;
      throw error;
    }

    await assertCanManage(requesterId, session.userId);

    // Desconecta el socket en vivo si sigue abierto (dispara el 'disconnect'
    // que cierra la sesión en BD) y además la cierra en BD directo, por si
    // el socket ya no existe (server reiniciado, etc.) y quedaría "fantasma".
    disconnectOneSession(String(session.userId), session.socketId);
    await closeSessionModel(session.socketId);
  },

  // Cierra todas las sesiones activas de un usuario (todos sus dispositivos).
  closeAllByUser: async (userId: number, requesterId: number): Promise<void> => {
    await assertCanManage(requesterId, userId);

    disconnectAllSessions(String(userId));
    await closeAllSessionsByUserModel(userId);
  },
};
