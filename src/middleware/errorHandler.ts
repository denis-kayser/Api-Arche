// middlewares/errorHandler.ts
import { ZodError } from "zod"
import { ErrorMiddlewareType } from "../types/express/express"
import { response } from "../util/response"
import { ErrorCode } from "../constants/errorCodes"
import { isDatabaseError, getDatabaseErrorCode, getDatabaseErrorMessage } from "../util/errors"

const STATUS_BY_ERROR_CODE: Partial<Record<ErrorCode, number>> = {
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.MISSING_PARAMS]: 400,
  [ErrorCode.MISSING_FIELD]: 400,
  [ErrorCode.INVALID_EMAIL]: 400,
  [ErrorCode.INVALID_PASSWORD]: 401,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.ACCESS_DENIED]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.USER_NOT_FOUND]: 404,
  [ErrorCode.DUPLICATE_ENTRY]: 409,
  [ErrorCode.DUPLICATE_EMAIL]: 409,
  [ErrorCode.DUPLICATE_USERNAME]: 409,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.DATABASE_CONNECTION_ERROR]: 503,
  [ErrorCode.DATABASE_TIMEOUT]: 503,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
}

export const errorHandler: ErrorMiddlewareType = (error, req, res, next) => {
  console.error('Error:', error)

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(', ')
    return response.error(res, ErrorCode.VALIDATION_ERROR, message, 400)
  }

  if (isDatabaseError(error)) {
    const code = getDatabaseErrorCode(error)
    return response.error(res, code, getDatabaseErrorMessage(code), 503)
  }

  const message = error instanceof Error ? error.message : 'Error interno del servidor'
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code: ErrorCode }).code
    : undefined

  if (code && code in STATUS_BY_ERROR_CODE) {
    return response.error(res, code, message, STATUS_BY_ERROR_CODE[code])
  }

  return response.error(res, ErrorCode.INTERNAL_ERROR, message, 500)
}
