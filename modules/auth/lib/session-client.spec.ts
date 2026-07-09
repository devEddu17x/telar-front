import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { decodeJwt } from 'jose'

import {
  clearClientSession,
  getClientIdToken,
  getClientSession,
  getRedirectPathByRole,
  refreshClientSession,
  saveClientSession
} from './session-client'

jest.mock('@aws-sdk/client-cognito-identity-provider', () => ({
  CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  InitiateAuthCommand: jest.fn(),
  AuthFlowType: { REFRESH_TOKEN_AUTH: 'REFRESH_TOKEN_AUTH' }
}))

jest.mock('jose', () => ({
  decodeJwt: jest.fn()
}))

describe('session-client', () => {
  beforeEach(() => {
    window.localStorage.clear()
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: ''
    })
    jest.clearAllMocks()
  })

  describe('Gestión de Tokens Local (save/clear)', () => {
    it('debería guardar y limpiar los tokens en localStorage', () => {
      ;(decodeJwt as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 3600
      })

      saveClientSession({ idToken: 'token123', refreshToken: 'refresh123' })

      expect(window.localStorage.getItem('telar.idToken')).toBe('token123')
      expect(window.localStorage.getItem('telar.refreshToken')).toBe(
        'refresh123'
      )

      clearClientSession()

      expect(window.localStorage.getItem('telar.idToken')).toBeNull()
      expect(window.localStorage.getItem('telar.refreshToken')).toBeNull()
    })
  })

  describe('getClientSession', () => {
    it('debería decodificar el token JWT y retornar la sesión formateada', () => {
      window.localStorage.setItem('telar.idToken', 'fake-token')
      ;(decodeJwt as jest.Mock).mockReturnValue({
        sub: 'user-123',
        email: 'test@ejemplo.com',
        name: 'Juan',
        family_name: 'Perez',
        'cognito:groups': ['owner'],
        'custom:tenant_id': 'tenant-999'
      })

      const session = getClientSession()

      expect(session).toEqual({
        userId: 'user-123',
        email: 'test@ejemplo.com',
        name: 'Juan',
        familyName: 'Perez',
        roles: ['owner'],
        tenantId: 'tenant-999'
      })
    })

    it('debería limpiar la sesión y retornar null si el token está expirado y no hay refresh token', () => {
      window.localStorage.setItem('telar.idToken', 'fake-token')
      ;(decodeJwt as jest.Mock).mockReturnValue({
        exp: Math.floor(Date.now() / 1000) - 100
      })

      const session = getClientSession()

      expect(session).toBeNull()
      expect(window.localStorage.getItem('telar.idToken')).toBeNull() // Se auto-limpió
    })
  })
})
