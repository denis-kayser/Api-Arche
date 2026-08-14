import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../../config/config';
import { formatInTimeZone } from 'date-fns-tz';
import { response } from '../../util/response';
import { SuccessCode } from '../../constants/successCodes';

export const tokenController = (req: Request, res: Response, next: NextFunction) => {
  try {

    // Payload del token
    const payload = {};

    // Opciones para el token
    const options: jwt.SignOptions = {
      expiresIn: "2h",
      issuer: "Arche-api",
      audience: "external-services"
    };

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }

    const token = jwt.sign(payload, JWT_SECRET, options);

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const formattedDate = formatInTimeZone(
      expiresAt,
      "America/Lima",
      "yyyy-MM-dd HH:mm:ss"
    );

    return response.success(res, SuccessCode.TOKEN_GENERATED, 'Autenticación exitosa', {
      access_token: token,
      expires_in: formattedDate
    });

  } catch (error) {
    next(error);
  }
};
