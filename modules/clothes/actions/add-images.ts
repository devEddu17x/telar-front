'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'
import type { PreSignedPut } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface AddImagesInput {
  filename: string
  contentType: string
}

interface AddImagesResponse {
  preSignedPuts: PreSignedPut[]
}

export async function addImages(
  clothesId: string,
  images: AddImagesInput[]
): Promise<ActionResponse<AddImagesResponse>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/clothes/${clothesId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify({ images })
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Prenda no encontrada'
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Add images API error:', response.status, errorText)
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    const data: AddImagesResponse = await response.json()

    revalidatePath('/admin/clothes')
    revalidatePath(`/admin/clothes/${clothesId}/edit`)

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Add images error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
