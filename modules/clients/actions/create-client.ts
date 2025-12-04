'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'
import type { ActionResponse } from '@/modules/auth/types'

import { CLIENT_ERRORS } from '../constants'
import { createClientSchema } from '../schemas'
import type { CreateClientResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function createClient(
  _prevState: ActionResponse<CreateClientResponse>,
  formData: FormData
): Promise<ActionResponse<CreateClientResponse>> {
  const rawData = {
    names: formData.get('names'),
    lastNames: formData.get('lastNames'),
    phone: formData.get('phone'),
    reference: formData.get('reference') || undefined
  }

  const validatedFields = createClientSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || CLIENT_ERRORS.UNKNOWN
    }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  const { names, lastNames, phone, reference } = validatedFields.data

  const body: Record<string, string> = { names, lastNames, phone }
  if (reference) {
    body.reference = reference
  }

  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`,
        'anti-csrf': antiCsrf || ''
      },
      body: JSON.stringify(body)
    })

    if (response.status === 409) {
      return {
        success: false,
        error: CLIENT_ERRORS.PHONE_EXISTS
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: CLIENT_ERRORS.UNKNOWN
      }
    }

    const data: CreateClientResponse = await response.json()

    revalidatePath('/admin/clients')

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Create client error:', error)
    return {
      success: false,
      error: CLIENT_ERRORS.UNKNOWN
    }
  }
}
