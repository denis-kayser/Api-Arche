// types/express.types.ts
import { Request, Response, NextFunction } from 'express';

// Tipo para cualquier middleware
export type MiddlewareType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Tipo para error middleware
export type ErrorMiddlewareType = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => void


// Tipo para controladores (sin next)
export type ParamsType = (
  req: Request,
  res: Response
) => Promise<void | Response> | void | Response;