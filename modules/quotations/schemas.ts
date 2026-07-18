import { z } from 'zod'

const optionalTextSchema = (
  min: number,
  max: number,
  fieldName: string
) =>
  z
    .string()
    .optional()
    .transform(value => (value === '' ? undefined : value))
    .pipe(
      z
        .string()
        .min(
          min,
          `${fieldName} debe tener al menos ${min} ${min === 1 ? 'carácter' : 'caracteres'}`
        )
        .max(max, `${fieldName} no puede exceder ${max} caracteres`)
        .optional()
    )

export const customizationSchema = z.object({
  name: optionalTextSchema(1, 100, 'El nombre'),
  number: z
    .number()
    .min(0, 'El número debe ser 0 o mayor')
    .max(100, 'El número no puede exceder 100')
    .optional(),
  notes: optionalTextSchema(1, 1024, 'Las notas')
})

export const quotationDetailSchema = z.object({
  clothesVariantId: z.string().uuid('ID de variante inválido'),
  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .min(1, 'La cantidad debe ser al menos 1')
    .max(100000, 'La cantidad no puede exceder 100000'),
  customizations: z
    .array(customizationSchema)
    .max(100, 'No se pueden agregar más de 100 personalizaciones')
    .optional()
})

export const createQuotationSchema = z.object({
  customerId: z.string().uuid('Debe seleccionar un cliente'),
  details: z
    .array(quotationDetailSchema)
    .min(1, 'Debe agregar al menos un artículo')
})

export const updateQuotationSchema = z.object({
  details: z
    .array(quotationDetailSchema)
    .min(1, 'Debe agregar al menos un artículo')
})

export type CreateQuotationInput = z.infer<typeof createQuotationSchema>
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>
