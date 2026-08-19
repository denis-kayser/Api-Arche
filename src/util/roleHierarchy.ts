import { prisma } from "../config/prisma"

export const PRIVILEGED_ROLES = ['SUPER ADMIN', 'ADMIN', 'SOPORTE']

export const getRoleDescription = async (userId: number): Promise<string> => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { roles: { select: { description: true } } },
  })
  return (user?.roles?.description ?? '').toUpperCase()
}

// Determina si `viewerRole` puede ver/gestionar las sesiones de un usuario con `targetRole`.
// - SUPER ADMIN: ve/gestiona a todos.
// - ADMIN / SOPORTE: ven/gestionan solo a usuarios sin rol privilegiado (no a otros ADMIN/SOPORTE/SUPER ADMIN).
// - Cualquier otro rol (o sin rol): no puede ver/gestionar sesiones ajenas (solo las propias, manejado aparte).
export const canManageRole = (viewerRole: string, targetRole: string): boolean => {
  if (viewerRole === 'SUPER ADMIN') return true
  if (viewerRole === 'ADMIN' || viewerRole === 'SOPORTE') {
    return !PRIVILEGED_ROLES.includes(targetRole)
  }
  return false
}
