// middlewares/errorHandler.ts
// import { ErrorMiddleware } from '../types/express/express';

import { ErrorMiddlewareType } from "../types/express/express"

export const errorHandler: ErrorMiddlewareType = (error, req, res, next) => {
  console.error('Error:', error)

  let message = 'Error interno del servidor'
  let code: string | undefined

  if (error instanceof Error) {
    message = error.message
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    code = (error as any).code
  }

  const isConnectionError =
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    message.includes('Connection terminated') ||
    message.includes('DB_HOST') ||
    message.includes('No se ha proporcionado DB_HOST')

  if (isConnectionError) {
    return res.status(503).json({
      ok: false,
      message: 'No se puede conectar al servidor de base de datos',
      data: null,
    })
  }

  return res.status(500).json({
    ok: false,
    message,
    data: null,
  })
}