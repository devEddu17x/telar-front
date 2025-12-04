import type { QuotationStatus } from './types'

interface QuotationStatusOption {
  value: QuotationStatus
  label: string
  color: 'yellow' | 'green' | 'red'
}

export const QUOTATION_STATUSES: QuotationStatusOption[] = [
  { value: 'PENDING', label: 'Pendiente', color: 'yellow' },
  { value: 'APPROVED', label: 'Aprobada', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelada', color: 'red' }
]

export const QUOTATION_ERRORS = {
  CUSTOMER_REQUIRED: 'Debe seleccionar un cliente',
  NO_ITEMS: 'Debe agregar al menos un artículo a la cotización',
  INVALID_QUANTITY: 'La cantidad debe ser mayor a 0',
  CUSTOMIZATIONS_MISMATCH:
    'La cantidad de personalizaciones debe coincidir con la cantidad de unidades',
  CUSTOMER_NOT_FOUND: 'Cliente no encontrado',
  VARIANT_NOT_FOUND: 'Variante de prenda no encontrada',
  UNKNOWN: 'Ocurrió un error inesperado'
} as const

export const QUOTATION_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Fecha de creación' },
  { value: 'total', label: 'Monto total' }
] as const

export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'Mayor a menor' },
  { value: 'asc', label: 'Menor a mayor' }
] as const

export type QuotationSortField =
  (typeof QUOTATION_SORT_OPTIONS)[number]['value']
export type SortOrder = (typeof SORT_ORDER_OPTIONS)[number]['value']
