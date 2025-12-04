'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLOTHES_ERRORS } from '../constants'
import type { CreateClothesResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface QuickCreateClothesData {
  name: string
  price: number
  images: {
    filename: string
    contentType: string
  }[]
}

export async function quickCreateClothes(
  data: QuickCreateClothesData
): Promise<ActionResponse<CreateClothesResponse>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/clothes/quick-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify({
        name: data.name,
        price: data.price,
        images: data.images
      })
    })

    if (response.status === 409) {
      return {
        success: false,
        error: CLOTHES_ERRORS.NAME_EXISTS
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        'Quick create clothes API error:',
        response.status,
        errorText
      )
      return {
        success: false,
        error: CLOTHES_ERRORS.UNKNOWN
      }
    }

    const clothesData: CreateClothesResponse = await response.json()

    revalidatePath('/admin/clothes')

    return {
      success: true,
      data: clothesData
    }
  } catch (error) {
    console.error('Quick create clothes error:', error)
    return {
      success: false,
      error: CLOTHES_ERRORS.UNKNOWN
    }
  }
}
