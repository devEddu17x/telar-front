import { useRouter } from 'next/navigation'

import { render, waitFor } from '@testing-library/react'

import { getClientSession } from '@/modules/auth/lib/session-client'
import { getCurrentEmployeeClient } from '@/modules/employees/lib/employees-client'

import { DashboardShellClient } from './dashboard-shell-client'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/modules/auth/lib/session-client', () => ({
  getClientSession: jest.fn()
}))

jest.mock('@/modules/employees/lib/employees-client', () => ({
  getCurrentEmployeeClient: jest.fn()
}))

jest.mock('./app-sidebar', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AppSidebar: ({ user }: any) => (
    <div data-testid='mock-sidebar'>Sidebar de {user.names}</div>
  )
}))

jest.mock('@/components/ui/sidebar', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SidebarProvider: ({ children }: any) => (
    <div data-testid='sidebar-provider'>{children}</div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SidebarInset: ({ children }: any) => (
    <div data-testid='sidebar-inset'>{children}</div>
  )
}))

describe('DashboardShellClient', () => {
  const mockReplace = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
    ;(getCurrentEmployeeClient as jest.Mock).mockResolvedValue({
      success: false
    })
  })

  it('debería redirigir a /unauthorized si el rol no está permitido', async () => {
    ;(getClientSession as jest.Mock).mockReturnValue({
      userId: '1',
      roles: ['seller'], // Rol distinto a los permitidos abajo
      tenantId: 't1'
    })

    render(
      <DashboardShellClient allowedRoles={['owner', 'admin']}>
        <div>Contenido Ultra Secreto</div>
      </DashboardShellClient>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/unauthorized')
    })
  })
})
