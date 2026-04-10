

// /**
//  * Datos base de la respuesta (siempre incluye code)
//  */
// export interface ResponseData<T = any> {
//   code: ApiCode;
//   result?: T;
//   details?: Record<string, any>;
//   [key: string]: any; // Para campos adicionales como retryAfter, total, etc.
// }

// /**
//  * Respuesta unificada de la API
//  */
// export interface ApiResponse<T = any> {
//   ok: boolean;
//   message: string;
//   data: ResponseData<T>;
// }

// // ============================================
// // 3. TIPOS ESPECÍFICOS POR CASO
// // ============================================

// /**
//  * Respuesta exitosa con lista paginada
//  */
// export interface PaginatedResponse<T> extends ApiResponse<T[]> {
//   data: ResponseData<T[]> & {
//     code: SuccessCode.LIST_FETCHED;
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// /**
//  * Respuesta exitosa con objeto único
//  */
// export interface ItemResponse<T> extends ApiResponse<T> {
//   data: ResponseData<T> & {
//     code: SuccessCode.FETCHED | SuccessCode.CREATED | SuccessCode.UPDATED;
//   };
// }

// /**
//  * Respuesta de error de validación
//  */
// export interface ValidationErrorResponse extends ApiResponse {
//   data: ResponseData & {
//     code: ValidationErrorCode.VALIDATION_ERROR;
//     details: Record<string, string[]>;
//   };
// }

// /**
//  * Respuesta de rate limit excedido
//  */
// export interface RateLimitResponse extends ApiResponse {
//   data: ResponseData & {
//     code: LimitErrorCode.RATE_LIMIT_EXCEEDED;
//     retryAfter: number; // segundos
//     limit: number;
//     remaining: number;
//   };
// }

// // ============================================
// // 4. FUNCIONES UTILITARIAS
// // ============================================

// /**
//  * Crear respuesta exitosa
//  */
// export function successResponse<T>(
//   message: string,
//   result: T,
//   code: SuccessCode = SuccessCode.SUCCESS
// ): ApiResponse<T> {
//   return {
//     ok: true,
//     message,
//     data: {
//       code,
//       result
//     }
//   };
// }

// /**
//  * Crear respuesta exitosa con lista paginada
//  */
// export function paginatedResponse<T>(
//   message: string,
//   items: T[],
//   total: number,
//   page: number,
//   limit: number
// ): PaginatedResponse<T> {
//   return {
//     ok: true,
//     message,
//     data: {
//       code: SuccessCode.LIST_FETCHED,
//       result: items,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit)
//     }
//   };
// }

// /**
//  * Crear respuesta de error
//  */
// export function errorResponse(
//   message: string,
//   code: ApiCode,
//   details?: Record<string, any>
// ): ApiResponse {
//   return {
//     ok: false,
//     message,
//     data: {
//       code,
//       ...(details && { details })
//     }
//   };
// }

// /**
//  * Crear respuesta de error de validación
//  */
// export function validationErrorResponse(
//   message: string,
//   details: Record<string, string[]>
// ): ValidationErrorResponse {
//   return {
//     ok: false,
//     message,
//     data: {
//       code: ValidationErrorCode.VALIDATION_ERROR,
//       details
//     }
//   };
// }

// /**
//  * Crear respuesta de rate limit
//  */
// export function rateLimitResponse(
//   retryAfter: number,
//   limit: number,
//   remaining: number
// ): RateLimitResponse {
//   return {
//     ok: false,
//     message: `Demasiadas peticiones. Espere ${retryAfter} segundos`,
//     data: {
//       code: LimitErrorCode.RATE_LIMIT_EXCEEDED,
//       retryAfter,
//       limit,
//       remaining
//     }
//   };
// }


// // ============================================
// // 5. DICCIONARIO COMPLETO CON METADATOS
// // ============================================

// /**
//  * Metadatos de cada código (para documentación o UI)
//  */
// export interface CodeMetadata {
//   code: ApiCode;
//   category: 'success' | 'auth' | 'resource' | 'validation' | 'request' | 'limit' | 'server' | 'special';
//   httpStatus: number;
//   description: string;
//   userMessage: string;
//   shouldRetry: boolean;
// }

// /**
//  * Diccionario completo con metadatos
//  */
// export const CODE_DICTIONARY: Record<ApiCode, CodeMetadata> = {
//   // Éxitos
//   [SuccessCode.SUCCESS]: {
//     code: SuccessCode.SUCCESS,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Operación genérica exitosa',
//     userMessage: 'Operación completada exitosamente',
//     shouldRetry: false
//   },
//   [SuccessCode.FETCHED]: {
//     code: SuccessCode.FETCHED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Datos recuperados exitosamente',
//     userMessage: 'Datos obtenidos correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.LIST_FETCHED]: {
//     code: SuccessCode.LIST_FETCHED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Lista de recursos recuperada',
//     userMessage: 'Lista obtenida correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.CREATED]: {
//     code: SuccessCode.CREATED,
//     category: 'success',
//     httpStatus: 201,
//     description: 'Recurso creado exitosamente',
//     userMessage: 'Recurso creado correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.UPDATED]: {
//     code: SuccessCode.UPDATED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Recurso actualizado exitosamente',
//     userMessage: 'Recurso actualizado correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.DELETED]: {
//     code: SuccessCode.DELETED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Recurso eliminado exitosamente',
//     userMessage: 'Recurso eliminado correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.LOGIN_SUCCESS]: {
//     code: SuccessCode.LOGIN_SUCCESS,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Inicio de sesión exitoso',
//     userMessage: 'Bienvenido',
//     shouldRetry: false
//   },
//   [SuccessCode.LOGOUT_SUCCESS]: {
//     code: SuccessCode.LOGOUT_SUCCESS,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Cierre de sesión exitoso',
//     userMessage: 'Sesión cerrada correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.TOKEN_GENERATED]: {
//     code: SuccessCode.TOKEN_GENERATED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Token generado exitosamente',
//     userMessage: 'Token de acceso generado',
//     shouldRetry: false
//   },
//   [SuccessCode.TOKEN_REFRESHED]: {
//     code: SuccessCode.TOKEN_REFRESHED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Token refrescado exitosamente',
//     userMessage: 'Token actualizado',
//     shouldRetry: false
//   },
//   [SuccessCode.PASSWORD_RESET]: {
//     code: SuccessCode.PASSWORD_RESET,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Contraseña restablecida',
//     userMessage: 'Contraseña restablecida correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.EMAIL_SENT]: {
//     code: SuccessCode.EMAIL_SENT,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Email enviado correctamente',
//     userMessage: 'Correo enviado',
//     shouldRetry: false
//   },
//   [SuccessCode.UPLOAD_SUCCESS]: {
//     code: SuccessCode.UPLOAD_SUCCESS,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Archivo subido exitosamente',
//     userMessage: 'Archivo subido correctamente',
//     shouldRetry: false
//   },
//   [SuccessCode.DOWNLOAD_SUCCESS]: {
//     code: SuccessCode.DOWNLOAD_SUCCESS,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Archivo descargado',
//     userMessage: 'Descarga iniciada',
//     shouldRetry: false
//   },
//   [SuccessCode.VALIDATION_PASSED]: {
//     code: SuccessCode.VALIDATION_PASSED,
//     category: 'success',
//     httpStatus: 200,
//     description: 'Validación de datos exitosa',
//     userMessage: 'Datos válidos',
//     shouldRetry: false
//   },

//   // Errores de autenticación
//   [AuthErrorCode.MISSING_TOKEN]: {
//     code: AuthErrorCode.MISSING_TOKEN,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'No se envió token de autenticación',
//     userMessage: 'Token no proporcionado',
//     shouldRetry: true
//   },
//   [AuthErrorCode.INVALID_TOKEN]: {
//     code: AuthErrorCode.INVALID_TOKEN,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'Token mal formado o inválido',
//     userMessage: 'Token inválido',
//     shouldRetry: false
//   },
//   [AuthErrorCode.EXPIRED_TOKEN]: {
//     code: AuthErrorCode.EXPIRED_TOKEN,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'Token expirado',
//     userMessage: 'Token expirado, inicie sesión nuevamente',
//     shouldRetry: true
//   },
//   [AuthErrorCode.MISSING_API_KEY]: {
//     code: AuthErrorCode.MISSING_API_KEY,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'No se envió API key',
//     userMessage: 'API key requerida',
//     shouldRetry: true
//   },
//   [AuthErrorCode.INVALID_API_KEY]: {
//     code: AuthErrorCode.INVALID_API_KEY,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'API key inválida',
//     userMessage: 'API key inválida',
//     shouldRetry: false
//   },
//   [AuthErrorCode.INVALID_CREDENTIALS]: {
//     code: AuthErrorCode.INVALID_CREDENTIALS,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'Email/contraseña incorrectos',
//     userMessage: 'Credenciales inválidas',
//     shouldRetry: true
//   },
//   [AuthErrorCode.ACCOUNT_LOCKED]: {
//     code: AuthErrorCode.ACCOUNT_LOCKED,
//     category: 'auth',
//     httpStatus: 423,
//     description: 'Cuenta bloqueada por muchos intentos',
//     userMessage: 'Cuenta bloqueada, contacte a soporte',
//     shouldRetry: false
//   },
//   [AuthErrorCode.ACCOUNT_INACTIVE]: {
//     code: AuthErrorCode.ACCOUNT_INACTIVE,
//     category: 'auth',
//     httpStatus: 401,
//     description: 'Cuenta no verificada o deshabilitada',
//     userMessage: 'Cuenta inactiva',
//     shouldRetry: false
//   },
//   [AuthErrorCode.ACCESS_DENIED]: {
//     code: AuthErrorCode.ACCESS_DENIED,
//     category: 'auth',
//     httpStatus: 403,
//     description: 'Usuario sin permisos para el recurso',
//     userMessage: 'Acceso denegado',
//     shouldRetry: false
//   },
//   [AuthErrorCode.ROLE_REQUIRED]: {
//     code: AuthErrorCode.ROLE_REQUIRED,
//     category: 'auth',
//     httpStatus: 403,
//     description: 'Se requiere rol específico',
//     userMessage: 'Se requiere rol de administrador',
//     shouldRetry: false
//   },

//   // Errores de recursos
//   [ResourceErrorCode.RESOURCE_NOT_FOUND]: {
//     code: ResourceErrorCode.RESOURCE_NOT_FOUND,
//     category: 'resource',
//     httpStatus: 404,
//     description: 'Recurso no existe',
//     userMessage: 'Recurso no encontrado',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.USER_NOT_FOUND]: {
//     code: ResourceErrorCode.USER_NOT_FOUND,
//     category: 'resource',
//     httpStatus: 404,
//     description: 'Usuario específico no existe',
//     userMessage: 'Usuario no encontrado',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.PRODUCT_NOT_FOUND]: {
//     code: ResourceErrorCode.PRODUCT_NOT_FOUND,
//     category: 'resource',
//     httpStatus: 404,
//     description: 'Producto no existe',
//     userMessage: 'Producto no encontrado',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.ORDER_NOT_FOUND]: {
//     code: ResourceErrorCode.ORDER_NOT_FOUND,
//     category: 'resource',
//     httpStatus: 404,
//     description: 'Orden no existe',
//     userMessage: 'Orden no encontrada',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.DUPLICATE_ENTRY]: {
//     code: ResourceErrorCode.DUPLICATE_ENTRY,
//     category: 'resource',
//     httpStatus: 409,
//     description: 'Recurso ya existe',
//     userMessage: 'Registro duplicado',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.DUPLICATE_EMAIL]: {
//     code: ResourceErrorCode.DUPLICATE_EMAIL,
//     category: 'resource',
//     httpStatus: 409,
//     description: 'Email ya registrado',
//     userMessage: 'Email ya está en uso',
//     shouldRetry: false
//   },
//   [ResourceErrorCode.DUPLICATE_USERNAME]: {
//     code: ResourceErrorCode.DUPLICATE_USERNAME,
//     category: 'resource',
//     httpStatus: 409,
//     description: 'Nombre de usuario ya existe',
//     userMessage: 'Nombre de usuario no disponible',
//     shouldRetry: false
//   },

//   // Errores de validación
//   [ValidationErrorCode.VALIDATION_ERROR]: {
//     code: ValidationErrorCode.VALIDATION_ERROR,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Error genérico de validación',
//     userMessage: 'Error de validación',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.MISSING_FIELD]: {
//     code: ValidationErrorCode.MISSING_FIELD,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Campo requerido no enviado',
//     userMessage: 'Campo requerido faltante',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_FORMAT]: {
//     code: ValidationErrorCode.INVALID_FORMAT,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Formato de dato incorrecto',
//     userMessage: 'Formato inválido',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_EMAIL]: {
//     code: ValidationErrorCode.INVALID_EMAIL,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Email mal formado',
//     userMessage: 'Email inválido',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_PASSWORD]: {
//     code: ValidationErrorCode.INVALID_PASSWORD,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Contraseña no cumple requisitos',
//     userMessage: 'Contraseña debe tener 8+ caracteres',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_PHONE]: {
//     code: ValidationErrorCode.INVALID_PHONE,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Teléfono mal formado',
//     userMessage: 'Teléfono inválido',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_DATE]: {
//     code: ValidationErrorCode.INVALID_DATE,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Fecha mal formada',
//     userMessage: 'Fecha inválida',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_NUMBER]: {
//     code: ValidationErrorCode.INVALID_NUMBER,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Número fuera de rango',
//     userMessage: 'Valor numérico inválido',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.INVALID_URL]: {
//     code: ValidationErrorCode.INVALID_URL,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'URL mal formada',
//     userMessage: 'URL inválida',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.FIELD_TOO_SHORT]: {
//     code: ValidationErrorCode.FIELD_TOO_SHORT,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Campo muy corto',
//     userMessage: 'Mínimo 3 caracteres',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.FIELD_TOO_LONG]: {
//     code: ValidationErrorCode.FIELD_TOO_LONG,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Campo muy largo',
//     userMessage: 'Máximo 100 caracteres',
//     shouldRetry: true
//   },
//   [ValidationErrorCode.VALUE_OUT_OF_RANGE]: {
//     code: ValidationErrorCode.VALUE_OUT_OF_RANGE,
//     category: 'validation',
//     httpStatus: 422,
//     description: 'Valor fuera del rango permitido',
//     userMessage: 'Valor fuera de rango',
//     shouldRetry: true
//   },

//   // Errores de petición
//   [RequestErrorCode.BAD_REQUEST]: {
//     code: RequestErrorCode.BAD_REQUEST,
//     category: 'request',
//     httpStatus: 400,
//     description: 'Petición mal formada',
//     userMessage: 'Petición inválida',
//     shouldRetry: true
//   },
//   [RequestErrorCode.INVALID_JSON]: {
//     code: RequestErrorCode.INVALID_JSON,
//     category: 'request',
//     httpStatus: 400,
//     description: 'JSON mal formado',
//     userMessage: 'JSON inválido',
//     shouldRetry: true
//   },
//   [RequestErrorCode.UNSUPPORTED_MEDIA]: {
//     code: RequestErrorCode.UNSUPPORTED_MEDIA,
//     category: 'request',
//     httpStatus: 415,
//     description: 'Content-Type no soportado',
//     userMessage: 'Tipo de contenido no soportado',
//     shouldRetry: true
//   },
//   [RequestErrorCode.METHOD_NOT_ALLOWED]: {
//     code: RequestErrorCode.METHOD_NOT_ALLOWED,
//     category: 'request',
//     httpStatus: 405,
//     description: 'Método HTTP no permitido',
//     userMessage: 'Método no permitido',
//     shouldRetry: false
//   },

//   // Errores de límites
//   [LimitErrorCode.RATE_LIMIT_EXCEEDED]: {
//     code: LimitErrorCode.RATE_LIMIT_EXCEEDED,
//     category: 'limit',
//     httpStatus: 429,
//     description: 'Excedió límite de peticiones',
//     userMessage: 'Demasiadas peticiones',
//     shouldRetry: true
//   },
//   [LimitErrorCode.QUOTA_EXCEEDED]: {
//     code: LimitErrorCode.QUOTA_EXCEEDED,
//     category: 'limit',
//     httpStatus: 429,
//     description: 'Excedió cuota de uso',
//     userMessage: 'Cuota excedida',
//     shouldRetry: false
//   },
//   [LimitErrorCode.FILE_TOO_LARGE]: {
//     code: LimitErrorCode.FILE_TOO_LARGE,
//     category: 'limit',
//     httpStatus: 413,
//     description: 'Archivo supera tamaño máximo',
//     userMessage: 'Archivo demasiado grande',
//     shouldRetry: true
//   },
//   [LimitErrorCode.MAX_RETRIES_EXCEEDED]: {
//     code: LimitErrorCode.MAX_RETRIES_EXCEEDED,
//     category: 'limit',
//     httpStatus: 429,
//     description: 'Excedió reintentos',
//     userMessage: 'Máximo de reintentos alcanzado',
//     shouldRetry: false
//   },

//   // Errores de servidor
//   [ServerErrorCode.SERVER_ERROR]: {
//     code: ServerErrorCode.SERVER_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error interno genérico',
//     userMessage: 'Error interno del servidor',
//     shouldRetry: true
//   },
//   [ServerErrorCode.DATABASE_ERROR]: {
//     code: ServerErrorCode.DATABASE_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error en base de datos',
//     userMessage: 'Error de base de datos',
//     shouldRetry: true
//   },
//   [ServerErrorCode.DATABASE_TIMEOUT]: {
//     code: ServerErrorCode.DATABASE_TIMEOUT,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Timeout en consulta DB',
//     userMessage: 'Tiempo de espera agotado',
//     shouldRetry: true
//   },
//   [ServerErrorCode.CONNECTION_ERROR]: {
//     code: ServerErrorCode.CONNECTION_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error de conexión a servicio',
//     userMessage: 'Error de conexión',
//     shouldRetry: true
//   },
//   [ServerErrorCode.REDIS_ERROR]: {
//     code: ServerErrorCode.REDIS_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error en Redis/Caché',
//     userMessage: 'Error en caché',
//     shouldRetry: true
//   },
//   [ServerErrorCode.QUEUE_ERROR]: {
//     code: ServerErrorCode.QUEUE_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error en cola de mensajes',
//     userMessage: 'Error en procesamiento',
//     shouldRetry: true
//   },
//   [ServerErrorCode.EXTERNAL_API_ERROR]: {
//     code: ServerErrorCode.EXTERNAL_API_ERROR,
//     category: 'server',
//     httpStatus: 502,
//     description: 'Error llamando API externa',
//     userMessage: 'Error con servicio externo',
//     shouldRetry: true
//   },
//   [ServerErrorCode.EXTERNAL_API_TIMEOUT]: {
//     code: ServerErrorCode.EXTERNAL_API_TIMEOUT,
//     category: 'server',
//     httpStatus: 504,
//     description: 'Timeout en API externa',
//     userMessage: 'Tiempo de espera agotado con servicio externo',
//     shouldRetry: true
//   },
//   [ServerErrorCode.FILE_SYSTEM_ERROR]: {
//     code: ServerErrorCode.FILE_SYSTEM_ERROR,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Error en sistema de archivos',
//     userMessage: 'Error al acceder a archivo',
//     shouldRetry: true
//   },
//   [ServerErrorCode.UPLOAD_FAILED]: {
//     code: ServerErrorCode.UPLOAD_FAILED,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Fallo en subida de archivo',
//     userMessage: 'Error al subir archivo',
//     shouldRetry: true
//   },
//   [ServerErrorCode.DOWNLOAD_FAILED]: {
//     code: ServerErrorCode.DOWNLOAD_FAILED,
//     category: 'server',
//     httpStatus: 500,
//     description: 'Fallo en descarga',
//     userMessage: 'Error al descargar archivo',
//     shouldRetry: true
//   },
//   [ServerErrorCode.SERVICE_UNAVAILABLE]: {
//     code: ServerErrorCode.SERVICE_UNAVAILABLE,
//     category: 'server',
//     httpStatus: 503,
//     description: 'Servicio no disponible temporalmente',
//     userMessage: 'Servicio en mantenimiento',
//     shouldRetry: true
//   },
//   [ServerErrorCode.DB_ERROR]: {
//     code: ServerErrorCode.DB_ERROR,
//     category: 'server',
//     httpStatus: 503,
//     description: 'Servicio no disponible temporalmente',
//     userMessage: 'Servicio en mantenimiento',
//     shouldRetry: true
//   },

//   // Códigos especiales
//   [SpecialCode.PENDING]: {
//     code: SpecialCode.PENDING,
//     category: 'special',
//     httpStatus: 202,
//     description: 'Operación en proceso',
//     userMessage: 'Operación pendiente',
//     shouldRetry: true
//   },
//   [SpecialCode.PROCESSING]: {
//     code: SpecialCode.PROCESSING,
//     category: 'special',
//     httpStatus: 202,
//     description: 'Procesando en background',
//     userMessage: 'Procesando solicitud',
//     shouldRetry: true
//   },
//   [SpecialCode.RETRY_LATER]: {
//     code: SpecialCode.RETRY_LATER,
//     category: 'special',
//     httpStatus: 429,
//     description: 'Operación debe reintentarse',
//     userMessage: 'Reintente más tarde',
//     shouldRetry: true
//   },
//   [SpecialCode.CONFLICT]: {
//     code: SpecialCode.CONFLICT,
//     category: 'special',
//     httpStatus: 409,
//     description: 'Conflicto de estado',
//     userMessage: 'Conflicto con estado actual',
//     shouldRetry: true
//   },
//   [SpecialCode.ALREADY_PROCESSED]: {
//     code: SpecialCode.ALREADY_PROCESSED,
//     category: 'special',
//     httpStatus: 200,
//     description: 'Recurso ya fue procesado',
//     userMessage: 'Solicitud ya procesada',
//     shouldRetry: false
//   },
//   [SpecialCode.OPERATION_CANCELLED]: {
//     code: SpecialCode.OPERATION_CANCELLED,
//     category: 'special',
//     httpStatus: 200,
//     description: 'Operación cancelada por usuario',
//     userMessage: 'Operación cancelada',
//     shouldRetry: false
//   },
//   [SpecialCode.MAINTENANCE_MODE]: {
//     code: SpecialCode.MAINTENANCE_MODE,
//     category: 'special',
//     httpStatus: 503,
//     description: 'Sistema en mantenimiento',
//     userMessage: 'Sistema en mantenimiento',
//     shouldRetry: true
//   }
// };

// /**
//  * Obtener metadatos de un código
//  */
// export function getCodeMetadata(code: ApiCode): CodeMetadata {
//   return CODE_DICTIONARY[code];
// }

// /**
//  * Verificar si un código es de éxito
//  */
// export function isSuccessCode(code: ApiCode): boolean {
//   return CODE_DICTIONARY[code]?.category === 'success';
// }

// /**
//  * Verificar si un código es de error de servidor
//  */
// export function isServerErrorCode(code: ApiCode): boolean {
//   return CODE_DICTIONARY[code]?.category === 'server';
// }

// /**
//  * Obtener mensaje amigable para usuario
//  */
// export function getUserMessage(code: ApiCode, defaultMessage?: string): string {
//   const metadata = CODE_DICTIONARY[code];
//   return metadata?.userMessage || defaultMessage || 'Error desconocido';
// }