'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'
import type { UpdateClothesInput } from '../schemas'
import type { Clothes } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function updateClothes(
  id: string,
  data: UpdateClothesInput
): Promise<ActionResponse<Clothes>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/clothes/${id}`, {
      method: 'PATCH',
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
        error: CLOTHES_ERRORS.NAME_EXISTS
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    const clothesData: Clothes = await response.json()

    revalidatePath('/admin/clothes')
    revalidatePath(`/admin/clothes/${id}`)

    return {
      success: true,
      data: clothesData
    }
  } catch (error) {
    console.error('Update clothes error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
