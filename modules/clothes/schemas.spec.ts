import {
  createClothesSchema,
  updateClothesSchema,
  variantSchema
} from './schemas'

const image = {
  file: new File(['image'], 'polo.jpg', { type: 'image/jpeg' }),
  preview: 'blob:polo'
}

const validClothes = {
  name: 'Polo',
  description: '',
  price: 1,
  variants: [{ gender: 'UNISEX' as const, size: 'M', additional: 0 }],
  images: [image]
}

describe('clothes schemas', () => {
  it('acepta una descripción vacía o de hasta 1024 caracteres', () => {
    expect(createClothesSchema.safeParse(validClothes).success).toBe(true)
    expect(
      createClothesSchema.safeParse({ ...validClothes, description: 'A' })
        .success
    ).toBe(true)
    expect(
      createClothesSchema.safeParse({
        ...validClothes,
        description: 'a'.repeat(1024)
      }).success
    ).toBe(true)
    expect(
      createClothesSchema.safeParse({
        ...validClothes,
        description: 'a'.repeat(1025)
      }).success
    ).toBe(false)
  })

  it('limita el precio base entre 1 y 1000', () => {
    expect(createClothesSchema.safeParse(validClothes).success).toBe(true)
    expect(
      createClothesSchema.safeParse({ ...validClothes, price: 1000 }).success
    ).toBe(true)
    expect(
      createClothesSchema.safeParse({ ...validClothes, price: 0 }).success
    ).toBe(false)
    expect(
      createClothesSchema.safeParse({ ...validClothes, price: 1000.01 })
        .success
    ).toBe(false)
  })

  it('limita el precio adicional de las variantes entre 0 y 1000', () => {
    expect(
      variantSchema.safeParse({ gender: 'UNISEX', size: 'M', additional: 0 })
        .success
    ).toBe(true)
    expect(
      variantSchema.safeParse({
        gender: 'UNISEX',
        size: 'M',
        additional: 1000
      }).success
    ).toBe(true)
    expect(
      variantSchema.safeParse({ gender: 'UNISEX', size: 'M', additional: -1 })
        .success
    ).toBe(false)
    expect(
      variantSchema.safeParse({
        gender: 'UNISEX',
        size: 'M',
        additional: 1000.01
      }).success
    ).toBe(false)
  })

  it('permite limpiar la descripción durante la edición', () => {
    expect(updateClothesSchema.safeParse({ description: '' }).success).toBe(
      true
    )
  })
})
