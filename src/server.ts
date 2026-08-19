import http from 'http'
import { Server } from 'socket.io'
import app from './app'
import { API_PORT } from './config/config'
import { setupSocket } from './socket/socketServer'
import { closeAllStaleSessionsModel } from './models/sessions/sessionModel'

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

setupSocket(io)

// El store de sockets en memoria siempre arranca vacío, así que cualquier
// sesión marcada "activa" de un arranque anterior del proceso es fantasma.
closeAllStaleSessionsModel()
  .then((count) => {
    if (count > 0) console.log(`Se limpiaron ${count} sesiones huérfanas de un arranque anterior`)
  })
  .catch((err) => console.error('Error al limpiar sesiones huérfanas:', err))

httpServer.listen(API_PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${API_PORT}`)
})