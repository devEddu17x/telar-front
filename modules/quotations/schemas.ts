import { z } from 'zod'

export const customizationSchema = z.object({
  name: z.string(),
  number: z.number().int().nonnegative('El número debe ser positivo o cero'),
  notes: z.string().optional()
})

export const quotationDetailSchema = z.object({
  clothesVariantId: z.string().uuid('ID de variante inválido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  customizations: z.array(customizationSchema)
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
