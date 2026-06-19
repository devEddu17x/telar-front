'use client'

import { decodeJwt } from 'jose'

import { AUTH_COOKIES, REDIRECT_PATHS } from '../constants'
import type { CognitoJWTPayload, Role, UserSession } from '../types'

const ID_TOKEN_STORAGE_KEY = 'telar.idToken'
const REFRESH_TOKEN_STORAGE_KEY = 'telar.refreshToken'

function getCookieMaxAge(token: string) {
  try {
    const payload = decodeJwt<CognitoJWTPayload>(token)
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp > now) {
      return payload.exp - now
    }
  } catch {
    return 60 * 60
  }

  return 60 * 60
}

function setBrowserCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}

function deleteBrowserCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

export function saveClientSession(tokens: {
  idToken: string
  refreshToken?: string
}) {
  const maxAge = getCookieMaxAge(tokens.idToken)

  window.localStorage.setItem(ID_TOKEN_STORAGE_KEY, tokens.idToken)
  setBrowserCookie(AUTH_COOKIES.ID_TOKEN, tokens.idToken, maxAge)

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
    setBrowserCookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, 60 * 60 * 24 * 30)
  }
}

export function clearClientSession() {
  window.localStorage.removeItem(ID_TOKEN_STORAGE_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  deleteBrowserCookie(AUTH_COOKIES.ID_TOKEN)
  deleteBrowserCookie(AUTH_COOKIES.REFRESH_TOKEN)
}

export function getClientIdToken() {
  return window.localStorage.getItem(ID_TOKEN_STORAGE_KEY)
}

export function getClientRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function normalizeRoles(rawRoles: string[] = []): Role[] {
  return rawRoles
    .map(role => role.toLowerCase())
    .filter((role): role is Role =>
      role === 'owner' || role === 'admin' || role === 'seller'
    )
}

export function getClientSession(): UserSession | null {
  const idToken = getClientIdToken()

  if (!idToken) return null

  try {
    const payload = decodeJwt<CognitoJWTPayload>(idToken)
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      clearClientSession()
      return null
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      familyName: payload.family_name,
      roles: normalizeRoles(payload['cognito:groups']),
      tenantId: payload['custom:tenant_id'] ?? null
    }
  } catch {
    clearClientSession()
    return null
  }
}

export function getRedirectPathFromToken(idToken: string) {
  const payload = decodeJwt<CognitoJWTPayload>(idToken)
  const roles = normalizeRoles(payload['cognito:groups'])

  if (!payload['custom:tenant_id']) {
    return '/tenant-setup'
  }

  if (roles.includes('owner')) return REDIRECT_PATHS.owner
  if (roles.includes('admin')) return REDIRECT_PATHS.admin
  if (roles.includes('seller')) return REDIRECT_PATHS.seller

  return '/sign-in'
}
