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

export const sessionService = {
  // Todas las sesiones activas del sistema (vista admin).
  getAll: async (): Promise<UserSession[]> => {
    return getAllActiveSessionsModel();
  },

  // Sesiones activas de un usuario puntual (para que el frontend muestre sus dispositivos).
  getByUser: async (userId: number): Promise<UserSession[]> => {
    return getActiveSessionsModel(userId);
  },

  // Cierra una sesión puntual (un dispositivo) por su id.
  close: async (sessionId: number): Promise<void> => {
    const session = await getSessionByIdModel(sessionId);

    if (!session) {
      const error: Error & { code?: ErrorCode } = new Error('Sesión no encontrada');
      error.code = ErrorCode.RESOURCE_NOT_FOUND;
      throw error;
    }

    // Desconecta el socket en vivo si sigue abierto (dispara el 'disconnect'
    // que cierra la sesión en BD) y además la cierra en BD directo, por si
    // el socket ya no existe (server reiniciado, etc.) y quedaría "fantasma".
    disconnectOneSession(String(session.userId), session.socketId);
    await closeSessionModel(session.socketId);
  },

  // Cierra todas las sesiones activas de un usuario (todos sus dispositivos).
  closeAllByUser: async (userId: number): Promise<void> => {
    disconnectAllSessions(String(userId));
    await closeAllSessionsByUserModel(userId);
  },
};
