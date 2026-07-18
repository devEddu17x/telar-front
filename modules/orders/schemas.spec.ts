import { addDays } from 'date-fns'

import { addressSchemaRefined, createOrderSchema } from './schemas'

const validOrder = {
  quoteId: '123e4567-e89b-12d3-a456-426614174000',
  address: {
    department: 'La Libertad',
    city: 'Trujillo',
    district: 'Trujillo',
    street: 'Av. España 123'
  }
}

describe('createOrderSchema', () => {
  it('acepta hoy y rechaza fechas pasadas', () => {
    expect(
      createOrderSchema.safeParse({
        ...validOrder,
        deliveryDate: new Date()
      }).success
    ).toBe(true)
    expect(
      createOrderSchema.safeParse({
        ...validOrder,
        deliveryDate: addDays(new Date(), -2)
      }).success
    ).toBe(false)
    expect(
      createOrderSchema.safeParse({
        ...validOrder,
        deliveryDate: addDays(new Date(), 366)
      }).success
    ).toBe(true)
  })

  it('aplica los límites de longitud de la dirección', () => {
    expect(addressSchemaRefined.safeParse(validOrder.address).success).toBe(
      true
    )
    expect(
      addressSchemaRefined.safeParse({
        ...validOrder.address,
        department: 'D'.repeat(101)
      }).success
    ).toBe(false)
    expect(
      addressSchemaRefined.safeParse({
        ...validOrder.address,
        city: 'C'.repeat(101)
      }).success
    ).toBe(false)
    expect(
      addressSchemaRefined.safeParse({
        ...validOrder.address,
        district: 'I'.repeat(101)
      }).success
    ).toBe(false)
    expect(
      addressSchemaRefined.safeParse({ ...validOrder.address, street: '' })
        .success
    ).toBe(false)
    expect(
      addressSchemaRefined.safeParse({
        ...validOrder.address,
        street: 'S'.repeat(256)
      }).success
    ).toBe(false)
  })
})
