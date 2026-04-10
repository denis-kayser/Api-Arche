import { Response } from 'express';
import { ErrorCode } from "../constants/errorCodes";
import { SuccessCode } from "../constants/successCodes";
import { ApiResponse } from '../types/response/response';

export const response = {
  success: <T>(
    res: Response,
    code: SuccessCode,
    message: string,
    data: T,
    status: number = 200
  ) => {
    const body: ApiResponse<T> = {
      ok: true,
      code,
      message,
      data,
    };

    return res.status(status).json(body);
  },

  error: (
    res: Response,
    code: ErrorCode,
    message: string,
    status: number = 500
  ) => {
    const body: ApiResponse<null> = {
      ok: false,
      code,
      message,
      data: null,
    };

    return res.status(status).json(body);
  },
};