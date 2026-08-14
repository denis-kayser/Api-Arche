import { z } from 'zod'

export const signInCredentialsSchema = z.object({
  email: z.email('El email no es válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const signInGoogleSchema = z.object({
  email: z.email('El email no es válido'),
  authID: z.string().min(1, 'El authID es requerido'),
})

export const signUpCredentialsSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rolID: z.coerce.number().int().optional(),
})

export const signUpGoogleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.email('El email no es válido'),
  imageUrl: z.string().min(1, 'La imagen es requerida'),
  authID: z.string().min(1, 'El authID es requerido'),
})
