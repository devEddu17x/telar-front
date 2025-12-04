export type QuotationStatus = 'PENDING' | 'APPROVED' | 'CANCELLED'

export interface Customization {
  name: string
  number: number
  notes?: string
}

export interface QuotationDetailInput {
  clothesVariantId: string
  quantity: number
  customizations: Customization[]
}

export interface QuotationDetail {
  id: string
  quoteId: string
  clothesVariantId: string
  quantity: number
  unitPrice: number
  customizations: Customization[]
}

export interface QuotationCustomer {
  id: string
  names: string
  lastNames: string
  phone: string
}

export interface Quotation {
  id: string
  total: string
  customerId: string
  status: QuotationStatus
  customer: QuotationCustomer
  totalClothes: number
  totalUnitsToProduced: number
  createdAt: string
  updatedAt: string
}

export interface CreateQuotationInput {
  customerId: string
  details: QuotationDetailInput[]
}

export interface UpdateQuotationInput {
  details: QuotationDetailInput[]
}

export interface CreateQuotationResponse {
  id: string
  total: number
  customerId: string
  status: QuotationStatus
  details: QuotationDetail[]
  createdAt: string
  updatedAt: string
}

// Tipos para detalle de cotización
export interface QuotationVariantSize {
  id: string
  size: string
}

export interface QuotationVariantGender {
  id: string
  gender: string
}

export interface QuotationClothesVariant {
  id: string
  clothesId: string
  sizeId: string
  genderId: string
  additional: string
  gender: QuotationVariantGender
  size: QuotationVariantSize
}

export interface QuotationDetailFull {
  id: string
  unitPrice: string
  quantity: number
  customizations: Customization[]
  quoteId: string
  clothesVariantId: string
  clothesVariant: QuotationClothesVariant
}

export interface QuotationCustomerFull extends QuotationCustomer {
  reference: string
  createdAt: string
  updatedAt: string
}

export interface QuotationWithDetails {
  id: string
  total: string
  customerId: string
  status: QuotationStatus
  createdAt: string
  updatedAt: string
  customer: QuotationCustomerFull
  details: QuotationDetailFull[]
}
