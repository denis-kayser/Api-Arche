import rateLimit from 'express-rate-limit'
import { response } from '../util/response'
import { ErrorCode } from '../constants/errorCodes'

const isProduction = process.env.NODE_ENV === 'production'

// Limita intentos de login/registro para mitigar fuerza bruta.
// En desarrollo se desactiva (skip) para no interrumpir pruebas manuales/curl repetidos.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction,
  handler: (req, res) => {
    response.error(
      res,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Demasiados intentos, inténtalo de nuevo más tarde',
      429
    )
  }
})
