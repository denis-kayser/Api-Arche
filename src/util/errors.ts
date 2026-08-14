// utils/errors.ts

import { Prisma } from "@prisma/client";
import { DB_CONNECTION_ERROR_MESSAGE } from "../config/prisma";
import { ErrorCode } from "../constants/errorCodes";

// validar que el error sea una instancia de Error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

export function isDatabaseError(error: unknown): boolean {
  const message = getErrorMessage(error);
  if (message.includes(DB_CONNECTION_ERROR_MESSAGE)) return true;

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientValidationError
  ) return true;

  return false;
}

export function getDatabaseErrorCode(error: unknown): ErrorCode {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return ErrorCode.DATABASE_CONNECTION_ERROR;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P1001': // no se puede alcanzar el servidor de BD
      case 'P1002': // timeout de conexión
        return ErrorCode.DATABASE_CONNECTION_ERROR;
      case 'P2002': // constraint único violado
        return ErrorCode.DUPLICATE_ENTRY;
      case 'P2025': // registro no encontrado
        return ErrorCode.RESOURCE_NOT_FOUND;
      default:
        return ErrorCode.DATABASE_UNKNOWN_ERROR;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return ErrorCode.DATABASE_SYNTAX_ERROR;
  }

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
    [ErrorCode.DUPLICATE_ENTRY]: 'El registro ya existe',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Recurso no encontrado',
  };

  return messages[errorCode] || 'Error en la base de datos';
}
