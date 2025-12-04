import type { Gender, Size } from './types'

export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'HOMBRE', label: 'Masculino' },
  { value: 'MUJER', label: 'Femenino' },
  { value: 'UNISEX', label: 'Unisex' }
]

export const SIZES: {
  value: Size
  label: string
  category: 'niños' | 'adultos'
}[] = [
  { value: '2', label: 'Talla 2', category: 'niños' },
  { value: '4', label: 'Talla 4', category: 'niños' },
  { value: '6', label: 'Talla 6', category: 'niños' },
  { value: '8', label: 'Talla 8', category: 'niños' },
  { value: '10', label: 'Talla 10', category: 'niños' },
  { value: '12', label: 'Talla 12', category: 'niños' },
  { value: '14', label: 'Talla 14', category: 'niños' },
  { value: 'XS', label: 'XS', category: 'adultos' },
  { value: 'S', label: 'S', category: 'adultos' },
  { value: 'M', label: 'M', category: 'adultos' },
  { value: 'L', label: 'L', category: 'adultos' },
  { value: 'XL', label: 'XL', category: 'adultos' },
  { value: 'XXL', label: 'XXL', category: 'adultos' }
]

export const CLOTHES_ERRORS = {
  DUPLICATE_VARIANT:
    'Ya existe una variante con esta combinación de talla y género',
  INVALID_PRICE: 'El precio debe ser un número positivo',
  NO_VARIANTS: 'Debe agregar al menos una variante',
  NO_IMAGES: 'Debe agregar al menos una imagen',
  NAME_EXISTS: 'Ya existe una prenda con este nombre',
  UNKNOWN: 'Ocurrió un error inesperado, intenta nuevamente'
} as const

export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
