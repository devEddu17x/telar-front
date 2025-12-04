import { z } from 'zod'

const phoneSchema = z
  .string()
  .length(9, 'El teléfono debe tener 9 dígitos')
  .regex(/^9\d{8}$/, 'El teléfono debe empezar con 9 y tener 9 dígitos')

export const createClientSchema = z.object({
  names: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres'),
  lastNames: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  phone: phoneSchema,
  reference: z.string().optional()
})

export const updateClientSchema = z.object({
  phone: phoneSchema,
  reference: z.string().optional()
})

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
