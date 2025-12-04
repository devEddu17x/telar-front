// Constantes para el catálogo e-commerce

export const CATALOG_ERROR_MESSAGES = {
  LOAD_ERROR: 'Error al cargar el catálogo',
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  PRODUCT_UNAVAILABLE: 'Este producto no está disponible'
} as const

export const PLACEHOLDER_IMAGE = '/placeholder-clothes.png'

export const GENDER_LABELS: Record<string, string> = {
  HOMBRE: 'Hombre',
  MUJER: 'Mujer',
  UNISEX: 'Unisex'
} as const
