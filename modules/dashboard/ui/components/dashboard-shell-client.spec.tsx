import { render, screen, waitFor } from '@testing-library/react';
import { DashboardShellClient } from './dashboard-shell-client';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/modules/auth/lib/session-client';
import { getCurrentEmployeeClient } from '@/modules/employees/lib/employees-client';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/modules/auth/lib/session-client', () => ({
  getClientSession: jest.fn()
}));

jest.mock('@/modules/employees/lib/employees-client', () => ({
  getCurrentEmployeeClient: jest.fn()
}));

jest.mock('./app-sidebar', () => ({
  AppSidebar: ({ user }: any) => <div data-testid="mock-sidebar">Sidebar de {user.names}</div>
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
  SidebarInset: ({ children }: any) => <div data-testid="sidebar-inset">{children}</div>
}));

describe('DashboardShellClient', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (getCurrentEmployeeClient as jest.Mock).mockResolvedValue({ success: false });
  });

  it('debería redirigir a /unauthorized si el rol no está permitido', async () => {
    (getClientSession as jest.Mock).mockReturnValue({
      userId: '1',
      roles: ['seller'], // Rol distinto a los permitidos abajo
      tenantId: 't1'
    });

    render(
      <DashboardShellClient allowedRoles={['owner', 'admin']}>
        <div>Contenido Ultra Secreto</div>
      </DashboardShellClient>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/unauthorized');
    });
  });
});
