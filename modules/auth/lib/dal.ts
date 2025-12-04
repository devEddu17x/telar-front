import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { decodeJwt } from 'jose'

import { AUTH_COOKIES, REDIRECT_PATHS } from '../constants'
import type { JWTPayload, Role, UserSession } from '../types'

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value

  if (!accessToken) {
    return null
  }

  try {
    const payload = decodeJwt<JWTPayload>(accessToken)

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    const roles = payload['st-role']?.v || []
    const permissions = payload['st-perm']?.v || []
    const appUserId = payload.appUserId?.v || ''

    return {
      userId: payload.sub,
      appUserId,
      email: '',
      roles: roles as Role[],
      permissions
    }
  } catch {
    return null
  }
}

export async function verifySession(): Promise<UserSession> {
  const session = await getSession()

  if (!session) {
    redirect('/sign-in')
  }

  return session
}

export async function requireRole(allowedRoles: Role[]): Promise<UserSession> {
  const session = await getSession()

  if (!session) {
    redirect('/sign-in')
  }

  const hasRole = session.roles.some(role => allowedRoles.includes(role))

  if (!hasRole) {
    redirect('/unauthorized')
  }

  return session
}

export function getRedirectPathByRole(roles: Role[]): string {
  if (roles.includes('admin')) {
    return REDIRECT_PATHS.admin
  }

  if (roles.includes('seller')) {
    return REDIRECT_PATHS.seller
  }

  return '/sign-in'
}

export async function getAntiCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value || null
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN)
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN)
  cookieStore.delete(AUTH_COOKIES.ANTI_CSRF)
  cookieStore.delete(AUTH_COOKIES.FRONT_TOKEN)
}
