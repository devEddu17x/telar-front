'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function deleteImage(
  clothesId: string,
  url: string
): Promise<ActionResponse<null>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/clothes/${clothesId}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify({ url })
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Imagen no encontrada'
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delete image API error:', response.status, errorText)
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    revalidatePath('/admin/clothes')
    revalidatePath(`/admin/clothes/${clothesId}/edit`)

    return {
      success: true,
      data: null
    }
  } catch (error) {
    console.error('Delete image error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
