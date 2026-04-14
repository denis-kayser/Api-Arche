import { Pool, QueryResult } from 'pg'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from './config'

const missingDbVars: string[] = []
export const DB_CONNECTION_ERROR_MESSAGE = 'No se puede conectar a la base de datos'

if (!DB_HOST) missingDbVars.push('DB_HOST')
if (!DB_PASSWORD) missingDbVars.push('DB_PASSWORD')


const dbErrorMessage = missingDbVars.length
  ? DB_CONNECTION_ERROR_MESSAGE
  : ''

const poolConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
  statement_timeout: 10000,
  query_timeout: 10000,
}

type DbPool =
  | Pool
  | {
    query: (text: string, values?: any[]) => Promise<QueryResult>
  }

export const pool: DbPool = missingDbVars.length === 0
  ? new Pool(poolConfig)
  : {
    query: async (): Promise<QueryResult> => {
      throw new Error(dbErrorMessage)
    },
  }

if ('on' in pool && typeof pool.on === 'function') {
  pool.on('error', (err: any) => {
    console.error('BD desconectada:', err.message)
  })
} else {
  console.error(
    `ERROR DE CONFIGURACIÓN: faltan parámetros de la base de datos: ${missingDbVars .join(', ')}. Las consultas a la base de datos devolverán un error de conexión.`
  )
}