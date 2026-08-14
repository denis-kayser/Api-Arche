import { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

// Valida req.body (o req.query, sin reescribirlo) contra un schema de zod.
// En caso de fallo, delega en errorHandler via next(error).
export const validate = (schema: ZodType, target: 'body' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (target === 'body') {
        req.body = schema.parse(req.body)
      } else {
        schema.parse(req.query)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
