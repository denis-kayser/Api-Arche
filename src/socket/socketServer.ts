import { Server, Socket } from 'socket.io'
import { socketStore } from './socketStore'
import { createSessionModel, closeSessionModel } from '../models/sessions/sessionModel'

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.auth.userId as string

        console.log(`Socket conectado: ${socket.id}`)

        if (userId) {
            socketStore.add(userId, socket.id)
            console.log(`Usuario ${userId} conectado`)

            createSessionModel({
                userId: Number(userId),
                socketId: socket.id,
                userAgent: socket.handshake.headers['user-agent'] ?? null,
                ipAddress: socket.handshake.address ?? null,
            })
                .then(() => io.emit('sessions_changed'))
                .catch((err) => console.error('Error al registrar la sesión:', err))
        }

        socket.on('disconnect', () => {
            console.log(`Socket desconectado: ${socket.id}`)
            // Eliminamos el socket del usuario del socketStore y cerramos la sesión en la base de datos

            if (userId) {
                socketStore.remove(userId, socket.id)
            }

            closeSessionModel(socket.id)
                .then(() => io.emit('sessions_changed'))
                .catch((err) => console.error('Error al cerrar la sesión:', err))
        })
    })
}
