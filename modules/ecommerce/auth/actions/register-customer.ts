'use server'

import { cookies } from 'next/headers'

import {
  AUTH_COOKIES,
  AUTH_ERROR_MESSAGES,
  ECOMMERCE_ROUTES
} from '../constants'
import { customerRegisterSchema } from '../schemas'
import type { ActionResponse, CustomerRegisterResponse } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function registerCustomer(
  _prevState: ActionResponse<{ redirectTo: string }>,
  formData: FormData
): Promise<ActionResponse<{ redirectTo: string }>> {
  const rawData = {
    names: formData.get('names'),
    lastNames: formData.get('lastNames'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  }

  const validatedFields = customerRegisterSchema.safeParse(rawData)

  if (!validatedFields.success) {
    const firstIssue = validatedFields.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR
    }
  }

  const { names, lastNames, email, password } = validatedFields.data

  try {
    // Paso 1: Registrar al cliente
    const registerResponse = await fetch(`${API_URL}/customers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        names,
        lastNames,
        email,
        password
      })
    })

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json().catch(() => null)

      // Verificar si es error de email duplicado
      if (registerResponse.status === 400 || registerResponse.status === 409) {
        return {
          success: false,
          error: errorData?.message || AUTH_ERROR_MESSAGES.EMAIL_EXISTS
        }
      }

      return {
        success: false,
        error: errorData?.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR
      }
    }

    ;(await registerResponse.json()) as CustomerRegisterResponse

    // Paso 2: Auto-login después del registro
    const loginResponse = await fetch(`${API_URL}/auth/signin`, {
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

    const loginData = await loginResponse.json()

    if (loginData.status !== 'OK') {
      // El registro fue exitoso pero el login falló
      // Redirigir al login para que inicie sesión manualmente
      return {
        success: true,
        data: { redirectTo: ECOMMERCE_ROUTES.SIGN_IN }
      }
    }

    // Guardar cookies de sesión
    const setCookieHeaders = loginResponse.headers.getSetCookie()
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

    const antiCsrf = loginResponse.headers.get('anti-csrf')
    if (antiCsrf) {
      cookieStore.set(AUTH_COOKIES.ANTI_CSRF, antiCsrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }

    const frontToken = loginResponse.headers.get('front-token')
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
    console.error('Register customer error:', error)
    return {
      success: false,
      error: AUTH_ERROR_MESSAGES.GENERIC_ERROR
    }
  }
}
