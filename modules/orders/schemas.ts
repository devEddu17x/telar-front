import { startOfDay } from 'date-fns'
import { z } from 'zod'

// Obtiene el "hoy" en la zona horaria de Lima
function getTodayInLima(): Date {
  const limaStr = new Date().toLocaleString('en-US', {
    timeZone: 'America/Lima'
  })
  return startOfDay(new Date(limaStr))
}

// Schema para dirección
export const addressSchemaRefined = z.object({
  department: z
    .string()
    .min(1, 'El departamento es requerido')
    .max(100, 'El departamento no puede exceder 100 caracteres'),
  city: z
    .string()
    .min(1, 'La ciudad o provincia es requerida')
    .max(100, 'La ciudad o provincia no puede exceder 100 caracteres'),
  district: z
    .string()
    .min(1, 'El distrito es requerido')
    .max(100, 'El distrito no puede exceder 100 caracteres'),
  street: z
    .string()
    .min(1, 'La dirección es requerida')
    .max(255, 'La dirección no puede exceder 255 caracteres')
})

// Schema para crear orden
export const createOrderSchema = z.object({
  quoteId: z.string().uuid('ID de cotización inválido'),
  deliveryDate: z
    .date({
      message: 'La fecha de entrega es requerida'
    })
    .refine(date => {
      const today = getTodayInLima()
      return date >= today
    }, 'La fecha de entrega no puede ser anterior a hoy'),
  address: addressSchemaRefined
})

// Tipo inferido del schema
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>

// Valores por defecto
export const createOrderDefaultValues: Partial<CreateOrderFormValues> = {
  deliveryDate: undefined,
  address: {
    department: '',
    city: '',
    district: '',
    street: ''
  }
}

// Schema para cancelar orden
export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres')
})

// Tipo inferido del schema de cancelación
export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>

// Valores por defecto para cancelar orden
export const cancelOrderDefaultValues: CancelOrderFormValues = {
  reason: ''
}
