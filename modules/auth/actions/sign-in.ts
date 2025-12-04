'use server'

import { cookies } from 'next/headers'

import { decodeJwt } from 'jose'

import { AUTH_COOKIES, AUTH_ERRORS, REDIRECT_PATHS } from '../constants'
import { signInSchema } from '../schemas'
import type { ActionResponse, JWTPayload, Role, SignInResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function signIn(
  _prevState: ActionResponse<{ redirectTo: string }>,
  formData: FormData
): Promise<ActionResponse<{ redirectTo: string }>> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const validatedFields = signInSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || AUTH_ERRORS.UNKNOWN
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
        error: AUTH_ERRORS.INVALID_CREDENTIALS
      }
    }

    if (data.status === 'FIELD_ERROR' && data.formFields) {
      return {
        success: false,
        error: data.formFields[0]?.error || AUTH_ERRORS.UNKNOWN
      }
    }

    if (data.status !== 'OK') {
      return {
        success: false,
        error: AUTH_ERRORS.UNKNOWN
      }
    }

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

    const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value

    if (!accessToken) {
      return {
        success: false,
        error: AUTH_ERRORS.UNKNOWN
      }
    }

    const payload = decodeJwt<JWTPayload>(accessToken)
    const roles = payload['st-role']?.v || []
    const primaryRole = roles[0] as Role | undefined

    const redirectTo = primaryRole ? REDIRECT_PATHS[primaryRole] : '/sign-in'

    return {
      success: true,
      data: { redirectTo }
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: AUTH_ERRORS.UNKNOWN
    }
  }
}
