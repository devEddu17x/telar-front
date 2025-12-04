// Constantes para autenticación e-commerce

export const ECOMMERCE_ROUTES = {
  CATALOG: '/',
  CART: '/cart',
  SIGN_IN: '/iniciar-sesion',
  SIGN_UP: '/sign-up',
  MY_ORDERS: '/my-orders',
  CHECKOUT: '/checkout'
} as const

export const AUTH_ERROR_MESSAGES = {
  EMAIL_EXISTS: 'El correo electrónico ya está registrado',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  PASSWORDS_MISMATCH: 'Las contraseñas no coinciden',
  GENERIC_ERROR: 'Error al procesar la solicitud',
  SESSION_EXPIRED: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
} as const

export const CUSTOMER_ROLE = 'customer' as const

// Cookies - reutilizamos las mismas del auth interno
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'sAccessToken',
  REFRESH_TOKEN: 'sRefreshToken',
  ANTI_CSRF: 'sAntiCsrf',
  FRONT_TOKEN: 'sFrontToken'
} as const
