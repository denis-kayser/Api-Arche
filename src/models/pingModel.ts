import { prisma } from '../config/prisma'

export const getPingModelo = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('DB Connection Error:', error)
    return false
  }
}
