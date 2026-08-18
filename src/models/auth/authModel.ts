import { prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";
import { SpResult, SpResultBasic } from "../../types/response/response";
import { UserRegisterGoogleProps, UserRegisterProps } from "../../types/users/register";
import { UserSignIn, UserSignInGoogle, UserSignInGoogleResponse } from "../../types/users/user";
import { SuccessCode } from "../../constants/successCodes";
import { ErrorCode } from "../../constants/errorCodes";

// ====================================
// Inicia Sesión
// ====================================
export const signInModel = {
  Credentials: async (data: UserRegisterProps): Promise<SpResult<UserSignIn>> => {
    const { email, password } = data;

    const user = await prisma.users.findFirst({
      where: { email, is_active: true, type_auth: 'CREDENTIALS' },
      select: { id: true, username: true, email: true, password_hash: true, image_url: true }
    });

    if (!user) {
      return {
        ok: false,
        code: ErrorCode.INVALID_EMAIL,
        message: 'Usuario no encontrado',
        data: [],
      };
    }

    const isMatch: boolean = await bcrypt.compare(password!, user.password_hash ?? '');

    if (!isMatch) {
      return {
        ok: false,
        code: ErrorCode.INVALID_PASSWORD,
        message: 'Contraseña incorrecta',
        data: [],
      };
    }

    return {
      ok: true,
      message: 'Inicio de sesión exitoso',
      code: SuccessCode.SUCCESS,
      data: {
        id: user.id,
        name: user.username ?? '',
        email: user.email,
        imageUrl: user.image_url ?? '',
      }
    };
  },
  Google: async (data: UserSignInGoogle): Promise<UserSignInGoogleResponse | undefined> => {
    const { email, authID } = data;

    const user = await prisma.users.findFirst({
      where: { email, auth_id: authID, is_active: true, type_auth: 'GOOGLE' },
      select: { id: true, username: true, email: true, image_url: true, type_auth: true }
    });

    if (!user) return undefined;

    return {
      id: user.id,
      name: user.username ?? '',
      email: user.email,
      imageUrl: user.image_url ?? '',
      typeAuth: user.type_auth,
    };
  }
}

// ====================================
// Crea Usurio
// ====================================
export const signUpModel = {
  Credentials: async (data: UserRegisterProps): Promise<SpResultBasic> => {
    const { name, email, password, rolID } = data;

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.users.findFirst({ where: { email: normalizedEmail } });
    if (existing) {
      const error: Error & { code?: ErrorCode } = new Error('El email ya está registrado');
      error.code = ErrorCode.DUPLICATE_EMAIL;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password!, salt);

    await prisma.$queryRaw`
      SELECT * FROM ft_register_user(
        ${name?.trim() ?? null}::varchar,
        ${normalizedEmail}::varchar,
        ${hashedPassword}::varchar,
        ${rolID ?? null}::integer,
        ${null}::text,
        ${null}::varchar,
        ${'CREDENTIALS'}::varchar
      )
    `;

    return { ok: true, message: 'Usuario registrado correctamente' };
  },
  Google: async (data: UserRegisterGoogleProps): Promise<SpResultBasic> => {
    const { name, email, imageUrl, authID } = data;

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.users.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          ...(authID ? [{ auth_id: authID, type_auth: 'GOOGLE' }] : [])
        ]
      }
    });
    if (existing) {
      const error: Error & { code?: ErrorCode } = new Error('El usuario ya está registrado');
      error.code = ErrorCode.DUPLICATE_EMAIL;
      throw error;
    }

    await prisma.$queryRaw`
      SELECT * FROM ft_register_user(
        ${name?.trim() ?? null}::varchar,
        ${normalizedEmail}::varchar,
        ${null}::varchar,
        ${null}::integer,
        ${imageUrl ?? null}::text,
        ${authID ?? null}::varchar,
        ${'GOOGLE'}::varchar
      )
    `;

    return { ok: true, message: 'Usuario registrado correctamente' };
  }
}
