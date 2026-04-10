import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config'
import { MiddlewareType } from '../types/express/express';


export const authMiddleware: MiddlewareType = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Token no proporcionado',
        data: { cod: 'MISSING_TOKEN' }
      });
    }

    if (!JWT_SECRET) {
      return res.status(400).json({
        ok: false,
        message: 'Credencial incompleta',
        data: { cod: 'MISSING_CREDENTIALS' }
      });
    }

    jwt.verify(token, JWT_SECRET, {
      issuer: "Arche-api",
      audience: "external-services"
    });

    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token inválido o expirado',
      data: { cod: 'INVALID_TOKEN' }
    });
  }
};