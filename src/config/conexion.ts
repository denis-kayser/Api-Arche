import { Pool, QueryResult } from 'pg'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from './config'

const dbHostMissingError = new Error(
  'No se ha proporcionado DB_HOST. No se puede conectar a la base de datos.'
)

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

export const pool: DbPool = DB_HOST
  ? new Pool(poolConfig)
  : {
    query: async (): Promise<QueryResult> => {
      throw dbHostMissingError
    },
  }

if ('on' in pool && typeof pool.on === 'function') {
  pool.on('error', (err: any) => {
    console.error('BD desconectada:', err.message)
  })
} else {
  console.error('ERROR DE CONFIGURACIÓN: falta DB_HOST. Las consultas a la base de datos devolverán un error de conexión.')
}