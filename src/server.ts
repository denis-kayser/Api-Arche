import http from 'http'
import { Server } from 'socket.io'
import app from './app'
import { API_PORT } from './config/config'
import { setupSocket } from './socket/socketServer'

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

setupSocket(io)

httpServer.listen(API_PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${API_PORT}`)
})