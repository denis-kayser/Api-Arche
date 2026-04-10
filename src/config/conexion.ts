import { Pool } from 'pg'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from './config'

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionTimeoutMillis: 10000,  // ✅ Esta sí existe en camelCase
  idleTimeoutMillis: 10000,        // ✅ Esta sí existe en camelCase
  statement_timeout: 10000,        // ✅ Esta es con guión bajo (sin "Millis")
  query_timeout: 10000,            // ✅ Alternativa con guión bajo
})

pool.on('error', (err) => {
  console.error('BD desconectada:', err.message)
})