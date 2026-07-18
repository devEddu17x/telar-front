import { customizationSchema, quotationDetailSchema } from './schemas'

const validDetail = {
  clothesVariantId: '123e4567-e89b-12d3-a456-426614174001',
  quantity: 1
}

describe('quotation schemas', () => {
  it('omite strings opcionales vacíos de una personalización', () => {
    const result = customizationSchema.safeParse({
      name: '',
      notes: ''
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ name: undefined, notes: undefined })
  })

  it('aplica los límites del backend para personalizaciones', () => {
    expect(
      customizationSchema.safeParse({
        name: 'A',
        number: 0,
        notes: 'N'
      }).success
    ).toBe(true)
    expect(
      customizationSchema.safeParse({ name: 'a'.repeat(101) }).success
    ).toBe(false)
    expect(customizationSchema.safeParse({ number: 100.01 }).success).toBe(
      false
    )
    expect(
      customizationSchema.safeParse({ notes: 'a'.repeat(1025) }).success
    ).toBe(false)
  })

  it('limita detalles a cantidades de 1 a 100000 y hasta 100 personalizaciones', () => {
    expect(quotationDetailSchema.safeParse(validDetail).success).toBe(true)
    expect(
      quotationDetailSchema.safeParse({ ...validDetail, quantity: 100000 })
        .success
    ).toBe(true)
    expect(
      quotationDetailSchema.safeParse({ ...validDetail, quantity: 100001 })
        .success
    ).toBe(false)
    expect(
      quotationDetailSchema.safeParse({
        ...validDetail,
        customizations: Array.from({ length: 101 }, () => ({}))
      }).success
    ).toBe(false)
  })
})
