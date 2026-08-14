import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { DATABASE_URL } from './config'

export const DB_CONNECTION_ERROR_MESSAGE = 'No se puede conectar a la base de datos'

const hasDatabaseUrl = Boolean(DATABASE_URL)

if (!hasDatabaseUrl) {
  console.error(
    'ERROR DE CONFIGURACIÓN: falta la variable DATABASE_URL. Las consultas a la base de datos devolverán un error de conexión.'
  )
}

export const prisma: PrismaClient = hasDatabaseUrl
  ? new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
  : new Proxy({} as PrismaClient, {
    get () {
      throw new Error(DB_CONNECTION_ERROR_MESSAGE)
    }
  })
