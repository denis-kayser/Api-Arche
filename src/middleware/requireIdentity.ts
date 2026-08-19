import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { response } from '../util/response'
import { ErrorCode } from '../constants/errorCodes'

// Resuelve quién hace la petición (header x-user-id, calculado server-side por
// el frontend a partir de su sesión) sin exigir un rol puntual — la
// autorización fina (qué puede ver/gestionar) se resuelve más abajo, en el
// service, según la jerarquía de roles.
export const requireIdentity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawUserId = req.headers['x-user-id']
    const userId = Number(Array.isArray(rawUserId) ? rawUserId[0] : rawUserId)

    if (!Number.isInteger(userId) || userId <= 0) {
      return response.error(res, ErrorCode.UNAUTHORIZED, 'No se pudo identificar al usuario que realiza la petición', 401)
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, is_active: true },
    })

    if (!user || !user.is_active) {
      return response.error(res, ErrorCode.UNAUTHORIZED, 'Usuario no encontrado o inactivo', 401)
    }

    req.currentUser = { id: user.id, roleDescription: null }

    next()
  } catch (error) {
    next(error)
  }
}
