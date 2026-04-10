import { pool } from '../config/conexion'


export const getPingModelo = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT 1 as ok')
    console.log('DB Response:', result.rows)
    return true
  } catch (error) {
    console.error('DB Connection Error:', error)
    return false
  }
}