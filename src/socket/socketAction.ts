// src/socket/socketActions.ts
import { io } from '../server'
import { socketStore } from './socketStore'

export function disconnectUser(userId: string) {
  const sockets = socketStore.get(userId)

  if (!sockets) return

  for (const socketId of sockets) {
    io.sockets.sockets.get(socketId)?.disconnect(true)
  }

  socketStore.delete(userId)
}