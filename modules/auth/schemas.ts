import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('El correo electrónico no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type SignInInput = z.infer<typeof signInSchema>
