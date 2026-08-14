import { NextFunction, Request, Response } from 'express'
import { getPingService } from '../service/pinService'
import { response } from '../util/response'
import { SuccessCode } from '../constants/successCodes'
import { ErrorCode } from '../constants/errorCodes'

export const getPingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPingService()

    if (!result.ok) {
      return response.error(res, ErrorCode.DATABASE_CONNECTION_ERROR, result.message, 503)
    }

    return response.success(res, SuccessCode.SUCCESS, result.message, { result: result.result })
  } catch (error) {
    next(error)
  }
}
