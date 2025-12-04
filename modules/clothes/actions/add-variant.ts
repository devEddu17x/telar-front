'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'
import type { AddVariantInput } from '../schemas'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface AddVariantResponse {
  id: string
  clothesId: string
  sizeId: string
  genderId: string
  additional: string
}

export async function addVariant(
  clothesId: string,
  data: AddVariantInput
): Promise<ActionResponse<AddVariantResponse>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/clothes/${clothesId}/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify(data)
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Prenda no encontrada'
      }
    }

    if (response.status === 409) {
      return {
        success: false,
        error: CLOTHES_ERRORS.DUPLICATE_VARIANT
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    const variantData: AddVariantResponse = await response.json()

    revalidatePath('/admin/clothes')
    revalidatePath(`/admin/clothes/${clothesId}`)

    return {
      success: true,
      data: variantData
    }
  } catch (error) {
    console.error('Add variant error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
