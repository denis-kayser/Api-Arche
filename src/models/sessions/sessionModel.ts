import { prisma } from "../../config/prisma";
import { CreateSessionProps, UserSession } from "../../types/sessions/session";

const mapSession = (session: {
  id: number;
  user_id: number;
  socket_id: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: Date | null;
  last_seen_at: Date | null;
}): UserSession => ({
  id: session.id,
  userId: session.user_id,
  socketId: session.socket_id,
  userAgent: session.user_agent,
  ipAddress: session.ip_address,
  createdAt: session.created_at ?? new Date(),
  lastSeenAt: session.last_seen_at,
});

// Registra una nueva sesión (llamado al conectar el socket).
export const createSessionModel = async (data: CreateSessionProps): Promise<void> => {
  await prisma.sessions.create({
    data: {
      user_id: data.userId,
      socket_id: data.socketId,
      user_agent: data.userAgent ?? null,
      ip_address: data.ipAddress ?? null,
      is_active: true,
    }
  });
};

// Cierra la sesión asociada a un socket (llamado al desconectar el socket).
export const closeSessionModel = async (socketId: string): Promise<void> => {
  await prisma.sessions.updateMany({
    where: { socket_id: socketId, is_active: true },
    data: { is_active: false, last_seen_at: new Date() }
  });
};

// Lista las sesiones activas de un usuario (para que el frontend muestre sus dispositivos conectados).
export const getActiveSessionsModel = async (userId: number): Promise<UserSession[]> => {
  const sessions = await prisma.sessions.findMany({
    where: { user_id: userId, is_active: true },
    orderBy: { created_at: 'desc' }
  });

  return sessions.map(mapSession);
};

// Busca una sesión puntual (para validar antes de cerrarla).
export const getSessionByIdModel = async (id: number): Promise<UserSession | null> => {
  const session = await prisma.sessions.findUnique({ where: { id } });
  return session ? mapSession(session) : null;
};

// Lista todas las sesiones activas del sistema (vista admin).
export const getAllActiveSessionsModel = async (): Promise<UserSession[]> => {
  const sessions = await prisma.sessions.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' }
  });

  return sessions.map(mapSession);
};

// Cierra en BD todas las sesiones de un usuario (además del kick en vivo por socket).
export const closeAllSessionsByUserModel = async (userId: number): Promise<void> => {
  await prisma.sessions.updateMany({
    where: { user_id: userId, is_active: true },
    data: { is_active: false, last_seen_at: new Date() }
  });
};
