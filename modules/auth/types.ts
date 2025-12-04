export type Role = 'admin' | 'seller'

export interface SignInResponse {
  status: 'OK' | 'WRONG_CREDENTIALS_ERROR' | 'FIELD_ERROR'
  user?: {
    id: string
    emails: string[]
    timeJoined: number
  }
  formFields?: Array<{
    id: string
    error: string
  }>
}

export interface JWTPayload {
  sub: string
  exp: number
  iat: number
  'st-role': {
    v: Role[]
    t: number
  }
  'st-perm': {
    v: string[]
    t: number
  }
  appUserId: {
    v: string
    t: number
  }
  sessionHandle: string
  antiCsrfToken: string
}

export interface UserSession {
  userId: string
  appUserId: string
  email: string
  roles: Role[]
  permissions: string[]
}

export interface ActionResponse<T = void> {
  success: boolean
  error?: string
  data?: T
  redirectTo?: string
}
