'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import type { Order } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function cancelOrder(
  id: string,
  reason: string
): Promise<ActionResponse<Order>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify({ reason })
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Orden no encontrada'
      }
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error:
          errorData.message ||
          'No se puede cancelar la orden. Verifica que esté en producción.'
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: 'Error al cancelar la orden'
      }
    }

    const data = await response.json()

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    return {
      success: true,
      data
    }
  } catch {
    return {
      success: false,
      error: 'Error de conexión al cancelar la orden'
    }
  }
}
