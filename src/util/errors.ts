// utils/errors.ts

import { DB_CONNECTION_ERROR_MESSAGE } from "../config/conexion";
import { ErrorCode } from "../constants/errorCodes";

// validar que el error sea una instancia de Error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}
export function isDatabaseError(error: any): boolean {
  const message = getErrorMessage(error);
  if (message.includes(DB_CONNECTION_ERROR_MESSAGE)) return true;
  // Timeout
  if (error.code === 'ETIMEDOUT') return true;
  // Conexión perdida
  if (error.code === 'ECONNREFUSED') return true;
  if (error.code === 'PROTOCOL_CONNECTION_LOST') return true;
  // Error de sintaxis SQL (PostgreSQL)
  if (error.code === '42601') return true;
  // Función no existe (PostgreSQL)
  if (error.code === '42883') return true;
  // Tabla no existe (PostgreSQL)
  if (error.code === '42P01') return true;

  return false;
}

export function getDatabaseErrorCode(error: any): ErrorCode {
  if (error.code === 'ETIMEDOUT') return ErrorCode.DATABASE_TIMEOUT;
  if (error.code === 'ECONNREFUSED') return ErrorCode.DATABASE_CONNECTION_ERROR;
  if (error.code === 'PROTOCOL_CONNECTION_LOST') return ErrorCode.DATABASE_CONNECTION_ERROR;
  if (error.code === '42601') return ErrorCode.DATABASE_SYNTAX_ERROR;
  if (error.code === '42883') return ErrorCode.DATABASE_SYNTAX_ERROR;
  if (getErrorMessage(error).includes('No se puede conectar')) return ErrorCode.DATABASE_CONNECTION_ERROR;

  return ErrorCode.DATABASE_UNKNOWN_ERROR;
}


// Mapa de mensajes para el cliente
export const getDatabaseErrorMessage = (errorCode: ErrorCode): string => {
  const messages: Partial<Record<ErrorCode, string>> = {
    [ErrorCode.DATABASE_TIMEOUT]: 'La consulta excedió el tiempo de espera',
    [ErrorCode.DATABASE_CONNECTION_ERROR]: 'No se puede conectar a la base de datos',
    [ErrorCode.DATABASE_SYNTAX_ERROR]: 'Error en la estructura de la consulta',
    [ErrorCode.DATABASE_UNKNOWN_ERROR]: 'Error en la base de datos',
    // Otros ErrorCodes que no son de BD (valores por defecto)
    // [ErrorCode.INTERNAL_ERROR]: 'Error interno del servidor',
    // [ErrorCode.BAD_REQUEST]: 'Solicitud incorrecta',
    // [ErrorCode.NOT_FOUND]: 'Recurso no encontrado'
  };

  return messages[errorCode] || 'Error en la base de datos';
}