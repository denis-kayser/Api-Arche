import { io } from "../../server"
import { socketStore } from "../../socket/socketStore"
import { closeSessionModel } from "../../models/sessions/sessionModel"

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

        closeSessionModel(socketId)
            .then(() => io.emit('sessions_changed'))
            .catch((error) => {
                console.error('Error cerrando sesión en BD:', error)
            })
    }

    socketStore.delete(userId)
}

export const disconnectOneSession = (userId: string, socketId: string): void => {
    const sockets = socketStore.get(userId)

    const socket = io.sockets.sockets.get(socketId)

    if (socket) {
        socket.emit('force_logout', {
            reason: 'DEVICE_TERMINATED'
        })

        socket.disconnect(true)
    }

    if (sockets) {
        socketStore.remove(userId, socketId)
    }

    closeSessionModel(socketId)
        .then(() => io.emit('sessions_changed'))
        .catch((error) => {
            console.error('Error cerrando sesión en BD:', error)
        })
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

            closeSessionModel(socketId)
                .then(() => io.emit('sessions_changed'))
                .catch((error) => {
                    console.error('Error cerrando sesión en BD:', error)
                })
        }
    }
}
