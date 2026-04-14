import { io } from "../../server"
import { socketStore } from "../../socket/socketStore"

export const disconnectAllSessions = (userId: string): void => {
    const sockets = socketStore.get(userId)

    if (!sockets) return

    for (const socketId of sockets) {
        const socket = io.sockets.sockets.get(socketId)

        if (socket) {
            socket.emit('force_logout', {
                reason: 'SESSION_TERMINATED'
            })

            socket.disconnect(true)
        }
    }

    socketStore.delete(userId)
}

export const disconnectOneSession = (userId: string, socketId: string): void => {
    const sockets = socketStore.get(userId)

    if (!sockets) return

    const socket = io.sockets.sockets.get(socketId)

    if (socket) {
        socket.emit('force_logout', {
            reason: 'DEVICE_TERMINATED'
        })

        socket.disconnect(true)

        socketStore.remove(userId, socketId)
    }
}

export const disconnectOtherSessions = (userId: string, currentSocketId: string): void => {
    const sockets = socketStore.get(userId)

    if (!sockets) return

    for (const socketId of sockets) {
        if (socketId !== currentSocketId) {
            const socket = io.sockets.sockets.get(socketId)

            if (socket) {
                socket.emit('force_logout', {
                    reason: 'LOGIN_FROM_ANOTHER_DEVICE'
                })

                socket.disconnect(true)
            }

            socketStore.remove(userId, socketId)
        }
    }
}