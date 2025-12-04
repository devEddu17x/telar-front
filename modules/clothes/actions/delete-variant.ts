'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function deleteVariant(
  clothesId: string,
  variantId: string
): Promise<ActionResponse<null>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(
      `${API_URL}/clothes/${clothesId}/variants/${variantId}`,
      {
        method: 'DELETE',
        headers: {
          Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
          'anti-csrf': antiCsrf || ''
        }
      }
    )

    if (response.status === 404) {
      return {
        success: false,
        error: 'Variante no encontrada'
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    revalidatePath('/admin/clothes')
    revalidatePath(`/admin/clothes/${clothesId}`)

    return {
      success: true,
      data: null
    }
  } catch (error) {
    console.error('Delete variant error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
