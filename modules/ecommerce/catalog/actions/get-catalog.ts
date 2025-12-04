'use server'

import { CATALOG_ERROR_MESSAGES } from '../constants'
import type { ActionResponse, CatalogClothes } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiClothes {
  id: string
  name: string
  description: string
  price: string
  isInEcommerce: boolean
  isDraft: boolean
  clothe_image: { url: string }[]
}

function transformClothes(apiClothes: ApiClothes): CatalogClothes {
  return {
    id: apiClothes.id,
    name: apiClothes.name,
    description: apiClothes.description,
    price: parseFloat(apiClothes.price),
    images: apiClothes.clothe_image?.map(img => ({ url: img.url })) || []
  }
}

export async function getCatalog(): Promise<ActionResponse<CatalogClothes[]>> {
  try {
    const url = `${API_URL}/clothes`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: 60
      }
    })

    if (!response.ok) {
      return {
        success: false,
        error: CATALOG_ERROR_MESSAGES.LOAD_ERROR
      }
    }

    const apiData: ApiClothes[] = await response.json()

    const activeClothes = apiData.filter(
      clothes => clothes.isInEcommerce && !clothes.isDraft
    )

    const catalogClothes = activeClothes.map(transformClothes)

    return {
      success: true,
      data: catalogClothes
    }
  } catch (error) {
    console.error('Error fetching catalog:', error)
    return {
      success: false,
      error: CATALOG_ERROR_MESSAGES.LOAD_ERROR
    }
  }
}
