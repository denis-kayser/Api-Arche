import { Server, Socket } from 'socket.io'
import { socketStore } from './socketStore'

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        const userId = socket.handshake.auth.userId as string

        console.log(`Socket conectado: ${socket.id}`)

        if (userId) {
            socketStore.add(userId, socket.id)
            console.log(`Usuario ${userId} conectado`)
        }

        socket.on('disconnect', () => {
            console.log(`Socket desconectado: ${socket.id}`)

            if (userId) {
                socketStore.remove(userId, socket.id)
            }
        })
    })
}