// src/socket/socketStore.ts
const connectedUsers = new Map<string, Set<string>>()

export const socketStore = {
    add(userId: string, socketId: string) {
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set())
        }

        connectedUsers.get(userId)?.add(socketId)
    },

    remove(userId: string, socketId: string) {
        const sockets = connectedUsers.get(userId)

        sockets?.delete(socketId)

        if (sockets?.size === 0) {
            connectedUsers.delete(userId)
        }
    },

    get(userId: string) {
        return connectedUsers.get(userId)
    },

    delete(userId: string) {
        connectedUsers.delete(userId)
    }
}