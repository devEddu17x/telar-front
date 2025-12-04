'use server'

import { cookies } from 'next/headers'

import {
  AUTH_COOKIES,
  AUTH_ERROR_MESSAGES,
  ECOMMERCE_ROUTES
} from '../constants'
import { customerLoginSchema } from '../schemas'
import type { ActionResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface SignInResponse {
  status: 'OK' | 'WRONG_CREDENTIALS_ERROR' | 'FIELD_ERROR'
  formFields?: Array<{ id: string; error: string }>
  user?: {
    id: string
    email: string
  }
}

export async function loginCustomer(
  _prevState: ActionResponse<{ redirectTo: string }>,
  formData: FormData
): Promise<ActionResponse<{ redirectTo: string }>> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const validatedFields = customerLoginSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR
    }
  }

  const { email, password } = validatedFields.data

  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password }
        ]
      })
    })

    const data: SignInResponse = await response.json()

    if (data.status === 'WRONG_CREDENTIALS_ERROR') {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
      }
    }

    if (data.status === 'FIELD_ERROR' && data.formFields) {
      return {
        success: false,
        error: data.formFields[0]?.error || AUTH_ERROR_MESSAGES.GENERIC_ERROR
      }
    }

    if (data.status !== 'OK') {
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.GENERIC_ERROR
      }
    }

    // Guardar cookies de sesión
    const setCookieHeaders = response.headers.getSetCookie()
    const cookieStore = await cookies()

    for (const cookieHeader of setCookieHeaders) {
      const [cookiePart] = cookieHeader.split(';')
      const [name, ...valueParts] = cookiePart.split('=')
      const value = valueParts.join('=')

      if (name === AUTH_COOKIES.ACCESS_TOKEN) {
        cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        })
      }

      if (name === AUTH_COOKIES.REFRESH_TOKEN) {
        cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/api/auth/session/refresh'
        })
      }
    }

    const antiCsrf = response.headers.get('anti-csrf')
    if (antiCsrf) {
      cookieStore.set(AUTH_COOKIES.ANTI_CSRF, antiCsrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }

    const frontToken = response.headers.get('front-token')
    if (frontToken) {
      cookieStore.set(AUTH_COOKIES.FRONT_TOKEN, frontToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }

    return {
      success: true,
      data: { redirectTo: ECOMMERCE_ROUTES.CATALOG }
    }
  } catch (error) {
    console.error('Login customer error:', error)
    return {
      success: false,
      error: AUTH_ERROR_MESSAGES.GENERIC_ERROR
    }
  }
}
