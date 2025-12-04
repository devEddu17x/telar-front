'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { QUOTATION_ERRORS } from '../constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface CancelQuotationResponse {
  id: string
  status: string
}

export async function cancelQuotation(
  id: string
): Promise<ActionResponse<CancelQuotationResponse>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  try {
    const response = await fetch(`${API_URL}/quotes/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      }
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Cotización no encontrada'
      }
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error:
          errorData.message ||
          'No se puede cancelar esta cotización. Solo se pueden cancelar cotizaciones pendientes.'
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: QUOTATION_ERRORS.UNKNOWN
      }
    }

    const result: CancelQuotationResponse = await response.json()

    revalidatePath('/admin/quotations')
    revalidatePath(`/admin/quotations/${id}`)

    return {
      success: true,
      data: result
    }
  } catch {
    return {
      success: false,
      error: QUOTATION_ERRORS.UNKNOWN
    }
  }
}
