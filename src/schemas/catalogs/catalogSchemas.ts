import { z } from 'zod'

export const documentTypeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  abbreviation: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
})

export const roleSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida').max(30),
  isActive: z.boolean().optional(),
})

export const permissionSchema = z.object({
  id: z.coerce.number().int().positive('El id es requerido'),
  name: z.string().min(1, 'El nombre es requerido').max(50),
  isActive: z.boolean().optional(),
})

export const permissionUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})
