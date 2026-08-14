import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { response } from '../util/response'
import { ErrorCode } from '../constants/errorCodes'

declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: number; roleDescription: string | null }
    }
  }
}

// Exige que el usuario que hace la petición (identificado por el header
// x-user-id, resuelto server-side por el frontend a partir de su sesión)
// tenga uno de los roles permitidos.
export const requireRole = (allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawUserId = req.headers['x-user-id']
      const userId = Number(Array.isArray(rawUserId) ? rawUserId[0] : rawUserId)

      if (!Number.isInteger(userId) || userId <= 0) {
        return response.error(res, ErrorCode.UNAUTHORIZED, 'No se pudo identificar al usuario que realiza la petición', 401)
      }

      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { id: true, is_active: true, roles: { select: { description: true } } },
      })

      if (!user || !user.is_active) {
        return response.error(res, ErrorCode.UNAUTHORIZED, 'Usuario no encontrado o inactivo', 401)
      }

      const roleDescription = (user.roles?.description ?? '').toUpperCase()
      const isAllowed = allowedRoles.some((role) => role.toUpperCase() === roleDescription)

      if (!isAllowed) {
        return response.error(res, ErrorCode.FORBIDDEN, 'No tienes permisos para realizar esta acción', 403)
      }

      req.currentUser = { id: user.id, roleDescription: user.roles?.description ?? null }

      next()
    } catch (error) {
      next(error)
    }
  }
