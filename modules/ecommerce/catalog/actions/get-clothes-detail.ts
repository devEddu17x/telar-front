'use server'

import { CATALOG_ERROR_MESSAGES } from '../constants'
import type { ActionResponse, ClothesDetail } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getClothesDetail(
  id: string
): Promise<ActionResponse<ClothesDetail>> {
  try {
    const url = `${API_URL}/clothes/${id}`

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
      if (response.status === 404) {
        return {
          success: false,
          error: CATALOG_ERROR_MESSAGES.PRODUCT_NOT_FOUND
        }
      }
      return {
        success: false,
        error: CATALOG_ERROR_MESSAGES.LOAD_ERROR
      }
    }

    const data: ClothesDetail = await response.json()

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error fetching clothes detail:', error)
    return {
      success: false,
      error: CATALOG_ERROR_MESSAGES.LOAD_ERROR
    }
  }
}
