import type { Role } from './types'

export const ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller'
} as const satisfies Record<string, Role>

export const REDIRECT_PATHS: Record<Role, string> = {
  admin: '/admin',
  seller: '/seller'
}

export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'sAccessToken',
  REFRESH_TOKEN: 'sRefreshToken',
  ANTI_CSRF: 'antiCsrf',
  FRONT_TOKEN: 'sFrontToken'
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  SESSION_EXPIRED: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
  UNAUTHORIZED: 'No tienes permisos para acceder a esta página',
  UNKNOWN: 'Ocurrió un error inesperado, intenta nuevamente'
} as const
