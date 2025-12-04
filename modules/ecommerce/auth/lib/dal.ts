import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { decodeJwt } from 'jose'

import { AUTH_COOKIES, CUSTOMER_ROLE, ECOMMERCE_ROUTES } from '../constants'
import type { CustomerJWTPayload, CustomerSession } from '../types'

/**
 * Obtiene la sesión del cliente autenticado
 * @returns CustomerSession o null si no hay sesión válida
 */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value

  if (!accessToken) {
    return null
  }

  try {
    const payload = decodeJwt<CustomerJWTPayload>(accessToken)

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    const roles = payload['st-role']?.v || []
    const permissions = payload['st-perm']?.v || []

    // Verificar que sea un cliente
    if (!roles.includes(CUSTOMER_ROLE)) {
      return null
    }

    return {
      userId: payload.sub,
      email: '', // El email no viene en el JWT, se obtiene del perfil
      roles,
      permissions
    }
  } catch {
    return null
  }
}

/**
 * Verifica que exista una sesión de cliente válida
 * Redirige a /sign-in si no hay sesión
 */
export async function verifyCustomerSession(): Promise<CustomerSession> {
  const session = await getCustomerSession()

  if (!session) {
    redirect(ECOMMERCE_ROUTES.SIGN_IN)
  }

  return session
}

/**
 * Verifica si hay un cliente autenticado
 * @returns true si hay sesión válida de cliente
 */
export async function isCustomerAuthenticated(): Promise<boolean> {
  const session = await getCustomerSession()
  return session !== null
}

/**
 * Limpia la sesión del cliente
 */
export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN)
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN)
  cookieStore.delete(AUTH_COOKIES.ANTI_CSRF)
  cookieStore.delete(AUTH_COOKIES.FRONT_TOKEN)
}

/**
 * Obtiene el token anti-CSRF
 */
export async function getAntiCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value || null
}
