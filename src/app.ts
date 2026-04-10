import express from 'express'
import { HOST, PORT } from './config/config'
import { authMiddleware } from './middleware/middleware'
import { errorHandler } from './middleware/errorHandler'

import pingRouter from './routers/pingRouter'
import tokenRouter from './routers/token/tokenRouter'
import authRouter from './routers/auth/authRouter'
import userRouter from './routers/users/userRouter'



const app = express()
app.use(express.json())

// Rutas publicas
app.use('/api/v1', pingRouter)
app.use('/api/v1', tokenRouter);  // obtener Token
app.use('/api/v1', authRouter); // autenticacion



// Rutas privadas
app.use('/api/v1', authMiddleware) // verificar Token
app.use('/api/v1', userRouter); // usuarios

// Middleware de errores
app.use(errorHandler)

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
