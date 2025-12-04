'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { QUOTATION_ERRORS } from '../constants'
import { createQuotationSchema } from '../schemas'
import type { CreateQuotationInput, CreateQuotationResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createQuotation(
  data: CreateQuotationInput
): Promise<ActionResponse<CreateQuotationResponse>> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  // Validate input
  const validationResult = createQuotationSchema.safeParse(data)
  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0]
    return {
      success: false,
      error: firstError?.message || QUOTATION_ERRORS.UNKNOWN
    }
  }

  const { customerId, details } = validationResult.data

  try {
    const response = await fetch(`${API_URL}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify({
        customerId,
        details
      })
    })

    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.message?.includes('customer')) {
        return {
          success: false,
          error: QUOTATION_ERRORS.CUSTOMER_NOT_FOUND
        }
      }
      return {
        success: false,
        error: QUOTATION_ERRORS.VARIANT_NOT_FOUND
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[createQuotation] API error:', response.status, errorText)
      return {
        success: false,
        error: QUOTATION_ERRORS.UNKNOWN
      }
    }

    const quotationData: CreateQuotationResponse = await response.json()

    revalidatePath('/admin/quotations')

    return {
      success: true,
      data: quotationData
    }
  } catch (error) {
    console.error('[createQuotation] Error:', error)
    return {
      success: false,
      error: QUOTATION_ERRORS.UNKNOWN
    }
  }
}
