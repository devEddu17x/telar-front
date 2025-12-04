export interface CatalogImage {
  url: string
}

export interface CatalogClothes {
  id: string
  name: string
  description: string
  price: number
  images: CatalogImage[]
}

// Tipos para detalle de prenda
export interface ClothesVariant {
  id: string
  additional: string
  size: {
    size: string
  }
  gender: {
    gender: string
  }
}

export interface ClothesDetail {
  id: string
  name: string
  description: string
  price: string
  isInEcommerce: boolean
  isDraft: boolean
  clothes_variant: ClothesVariant[]
  clothe_image: { url: string }[]
}

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
