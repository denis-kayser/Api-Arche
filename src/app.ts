// src/app.ts
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { authMiddleware } from './middleware/middleware'
import { errorHandler } from './middleware/errorHandler'

import pingRouter from './routers/pingRouter'
import tokenRouter from './routers/token/tokenRouter'
import authRouter from './routers/auth/authRouter'
import userRouter from './routers/users/userRouter'
import moduleRouter from './routers/module/moduleRouter'
import catalogRouter from './routers/catalogs/catalogRouter'
import sessionRouter from './routers/sessions/sessionRouter'


const app = express()
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// Rutas publicas
app.use('/api/v1', pingRouter)
app.use('/api/v1', tokenRouter);  // obtener Token
app.use('/api/v1', authRouter); // autenticacion



// Rutas privadas
app.use('/api/v1', authMiddleware) // verificar Token
app.use('/api/v1', moduleRouter); // modulos
app.use('/api/v1', userRouter); // usuarios
app.use('/api/v1', catalogRouter); // mantenimientos: tipos de documento, roles, permisos
app.use('/api/v1', sessionRouter); // sesiones activas

// Middleware de errores
app.use(errorHandler)

export default app;