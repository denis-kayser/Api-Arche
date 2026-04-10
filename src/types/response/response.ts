import { ErrorCode } from "../../constants/errorCodes";
import { SuccessCode } from "../../constants/successCodes";


export interface SpResult<T> {
  ok: boolean;
  message: string;
  data: T;
}


export type SpResultBasic = {
  ok: boolean;
  message: string;
};


export interface ApiResponse<T = any> {
  ok: boolean;
  code: SuccessCode | ErrorCode;
  message: string;
  data: T;
}
