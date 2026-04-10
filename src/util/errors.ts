// utils/errors.ts
// validar que el error sea una instancia de Error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}