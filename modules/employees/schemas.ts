import { z } from 'zod'

export const createEmployeeSchema = z.object({
  names: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres'),
  lastNames: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.email('El correo electrónico no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
