// Tipos para autenticación de clientes e-commerce

export interface EcommerceCustomer {
  id: string
  names: string
  lastNames: string
  email: string
}

export interface CustomerRegisterInput {
  names: string
  lastNames: string
  email: string
  password: string
  confirmPassword: string
}

export interface CustomerRegisterResponse {
  message: string
  customer: EcommerceCustomer
}

export interface CustomerLoginInput {
  email: string
  password: string
}

export interface CustomerSession {
  userId: string
  email: string
  roles: string[]
  permissions: string[]
}

// JWT payload para clientes
export interface CustomerJWTPayload {
  sub: string
  iat: number
  exp: number
  tId: string
  rsub: string
  sessionHandle: string
  iss: string
  'st-role': {
    v: string[]
    t: number
  }
  'st-perm': {
    v: string[]
    t: number
  }
}

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
