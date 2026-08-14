import { z } from 'zod'

export const userFiltersSchema = z.object({
  name: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  rolId: z.coerce.number().int().optional(),
})

export const updateUserSchema = z.object({
  username: z.string().min(1, 'El nombre es requerido').max(50).optional(),
  alias: z.string().max(255).optional(),
  imageUrl: z.string().url('La URL de la imagen no es válida').max(255).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar',
})
