import { z } from 'zod'

// Schema para registro de cliente
export const customerRegisterSchema = z
  .object({
    names: z
      .string()
      .min(2, 'Los nombres deben tener al menos 2 caracteres')
      .max(100, 'Los nombres no pueden exceder 100 caracteres'),
    lastNames: z
      .string()
      .min(2, 'Los apellidos deben tener al menos 2 caracteres')
      .max(100, 'Los apellidos no pueden exceder 100 caracteres'),
    email: z.string().email('El correo electrónico no tiene un formato válido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(50, 'La contraseña no puede exceder 50 caracteres'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

// Schema para login de cliente
export const customerLoginSchema = z.object({
  email: z.string().email('El correo electrónico no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

// Tipos inferidos de los schemas
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>

// Valores por defecto
export const customerRegisterDefaultValues: CustomerRegisterInput = {
  names: '',
  lastNames: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export const customerLoginDefaultValues: CustomerLoginInput = {
  email: '',
  password: ''
}
