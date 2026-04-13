import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../../config/config';
import { formatInTimeZone } from 'date-fns-tz';

export const tokenController = (req: Request, res: Response) => {
  try {

    // Payload del token
    const payload = {
      // userId: req.body.userId || 'test-user',
      // role: req.body.role || 'user',
      // timestamp: Date.now()
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
        token_type: "Bearer",
        expires_in: formattedDate
        // expires_in: expiresAt.toLocaleDateString('es-PE') + ' ' + expiresAt.toLocaleTimeString('es-PE'),
        // iso: expiresAt.toISOString(),                      // "2026-04-09T16:25:28.000Z"
        // seconds: 7200                                      // 2 horas en segundos
        // }
      }
    });

  } catch (error: any) {

    console.error('Error generando token:', error);

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      data: { cod: 'INTERNAL_SERVER_ERROR' }
    });
  }
};