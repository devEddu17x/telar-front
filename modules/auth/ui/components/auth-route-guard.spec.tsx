import { usePathname, useRouter } from 'next/navigation'

import { render, waitFor } from '@testing-library/react'

import {
  getClientSession,
  getRedirectPathByRole
} from '@/modules/auth/lib/session-client'

import { AuthRouteGuard } from './auth-route-guard'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}))

jest.mock('@/modules/auth/lib/session-client', () => ({
  getClientSession: jest.fn(),
  getRedirectPathByRole: jest.fn()
}))

describe('AuthRouteGuard', () => {
  const mockReplace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
    ;(usePathname as jest.Mock).mockReturnValue('/current-path')
  })

  describe('modo "guest"', () => {
    it('debería redirigir al dashboard si hay sesión completa', async () => {
      ;(getClientSession as jest.Mock).mockReturnValue({
        userId: '123',
        roles: ['owner'],
        tenantId: 't-1' // ¡Tiene su empresa/tenant completo!
      })
      ;(getRedirectPathByRole as jest.Mock).mockReturnValue('/admin')

      render(
        <AuthRouteGuard mode='guest'>
          <div>Contenido Guest</div>
        </AuthRouteGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/admin')
      })
    })

    it('debería redirigir a tenant-setup si falta tenantId', async () => {
      ;(getClientSession as jest.Mock).mockReturnValue({
        userId: '123',
        roles: ['owner'],
        tenantId: null
      })

      render(
        <AuthRouteGuard mode='guest'>
          <div>Contenido Guest</div>
        </AuthRouteGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/tenant-setup')
      })
    })
  })

  describe('modo "tenant-setup"', () => {
    it('debería redirigir a sign-in si no hay sesión', async () => {
      ;(getClientSession as jest.Mock).mockReturnValue(null)

      render(
        <AuthRouteGuard mode='tenant-setup'>
          <div>Setup</div>
        </AuthRouteGuard>
      )

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/sign-in')
      })
    })
  })
})
