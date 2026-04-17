import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../../config/config';
import { formatInTimeZone } from 'date-fns-tz';
import { ErrorCode } from '../../constants/errorCodes';
import { UserSignIn } from '../../types/users/user';
import { getUserByID } from '../../models/users/userModel';

export const tokenController = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json({
        ok: false,
        code: ErrorCode.MISSING_PARAMS,
        message: 'UserID es requerido',
        data: []
      });
    }

    const signInResult = await getUserByID({ userID });

    if (!signInResult.ok) {
      return res.status(401).json({
        ok: false,
        code: signInResult.code,
        message: signInResult.message || 'Credenciales inválidas',
        data: []
      });
    }

    const user = signInResult.data as UserSignIn;
    console.log({ user })

    // Payload del token
    const payload = {
      userId: user.id,
      timestamp: Date.now()
    };

    // Opciones para el token
    const options: jwt.SignOptions = {
      expiresIn: "2h",
      issuer: "Arche-api",
      audience: "external-services"
    };

    // Asegurar que JWT_SECRET no sea undefined
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

    return res.json({
      ok: true,
      message: "Autenticación exitosa",
      data: {
        access_token: token,
        expires_in: formattedDate
      }
    });

  } catch (error: any) {

    console.error('Error generando token:', error);

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      data: { code: ErrorCode.INTERNAL_ERROR }
    });
  }
};