import { refreshClientSession } from '@/modules/auth/lib/session-client';

jest.mock('@/modules/auth/lib/session-client', () => ({
  refreshClientSession: jest.fn(),
}));

describe('api client', () => {
  const originalEnv = process.env;

  let apiRequest: any;
  let ApiError: any;
  let mockRefreshClientSession: any;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com'; // Seteamos URL por defecto falsa

    global.fetch = jest.fn();

    mockRefreshClientSession = require('@/modules/auth/lib/session-client').refreshClientSession;

    const client = require('./client');
    apiRequest = client.apiRequest;
    ApiError = client.ApiError;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('apiRequest', () => {

    it('debería lanzar un error si no hay NEXT_PUBLIC_API_URL', async () => {
      jest.resetModules();
      delete process.env.NEXT_PUBLIC_API_URL;
      const testClient = require('./client');

      await expect(testClient.apiRequest('/test')).rejects.toThrow('NEXT_PUBLIC_API_URL no está configurada');
    });

    it('debería realizar una petición exitosa y retornar JSON (Camino Feliz)', async () => {
      const mockData = { id: 1, name: 'test' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockData)),
      });

      const response = await apiRequest('/test-endpoint');

      expect(global.fetch).toHaveBeenCalledWith('https://api.test.com/test-endpoint', expect.any(Object));
      expect(response).toEqual(mockData);
    });

    it('debería intentar refrescar la sesión y reintentar si recibe error 401', async () => {
      const mockData = { success: true };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 401,
        ok: false,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify({ message: 'Unauthorized' })),
      });

      mockRefreshClientSession.mockResolvedValueOnce('nuevo-token-123');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockData)),
      });

      const response = await apiRequest('/protected', { token: 'token-viejo' });

      expect(mockRefreshClientSession).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(response).toEqual(mockData);
    });

  });
});
