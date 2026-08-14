export interface UserSession {
  id: number;
  userId: number;
  socketId: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastSeenAt: Date | null;
}

export interface CreateSessionProps {
  userId: number;
  socketId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}
