import { signInClient, signUpClient, signOutClient } from './auth-client';
import { apiRequest } from '@/lib/api/client';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { saveClientSession, clearClientSession } from './session-client';

jest.mock('@/lib/api/client', () => ({
  apiRequest: jest.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    body: any;
    constructor(status: number, message: string, body: any) {
      super(message);
      this.status = status;
      this.body = body;
    }
  }
}));

jest.mock('./session-client', () => ({
  saveClientSession: jest.fn(),
  clearClientSession: jest.fn(),
  getRedirectPathFromToken: jest.fn().mockReturnValue('/admin')
}));

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  const mockSend = jest.fn();
  const MockClient = jest.fn().mockImplementation(() => ({
    send: mockSend
  }));
  (MockClient as any).mockSend = mockSend;

  class DummyError extends Error {}

  return {
    CognitoIdentityProviderClient: MockClient,
    InitiateAuthCommand: jest.fn(),
    ConfirmSignUpCommand: jest.fn(),
    ResendConfirmationCodeCommand: jest.fn(),
    ForgotPasswordCommand: jest.fn(),
    ConfirmForgotPasswordCommand: jest.fn(),
    RespondToAuthChallengeCommand: jest.fn(),
    AuthFlowType: { USER_PASSWORD_AUTH: 'USER_PASSWORD_AUTH', REFRESH_TOKEN_AUTH: 'REFRESH_TOKEN_AUTH' },
    NotAuthorizedException: DummyError,
    UserNotConfirmedException: DummyError
  };
});

describe('auth-client', () => {
  let mockCognitoSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCognitoSend = (CognitoIdentityProviderClient as any).mockSend;
    mockCognitoSend.mockClear();
  });

  describe('signUpClient', () => {
    it('debería registrar al usuario exitosamente llamando a /auth/register', async () => {
      (apiRequest as jest.Mock).mockResolvedValueOnce({ success: true });

      const input = {
        firstName: 'Carlos',
        lastName: 'Perez',
        email: 'carlos@test.com',
        password: 'Password123!',
        acceptedTerms: true
      };

      const response = await signUpClient(input);

      expect(apiRequest).toHaveBeenCalledWith('/auth/register', expect.any(Object));
      expect(response).toEqual({ success: true, data: { email: 'carlos@test.com' } });
    });

    it('debería fallar si los datos no cumplen con el esquema de Zod (contraseña débil)', async () => {
      const input = {
        firstName: 'Carlos',
        lastName: 'Perez',
        email: 'carlos@test.com',
        password: '123', // ¡Demasiado corta y sin símbolos!
        acceptedTerms: true
      };

      const response = await signUpClient(input);

      expect(response.success).toBe(false);
      
      expect(apiRequest).not.toHaveBeenCalled();
    });
  });

  describe('signInClient', () => {
    it('debería iniciar sesión y guardar los tokens al recibir respuesta exitosa de Cognito', async () => {
      mockCognitoSend.mockResolvedValueOnce({
        AuthenticationResult: {
          IdToken: 'fake-id-token',
          RefreshToken: 'fake-refresh-token'
        }
      });

      const input = { email: 'test@test.com', password: 'Password123!' };
      const response = await signInClient(input);

      expect(mockCognitoSend).toHaveBeenCalledTimes(1);
      
      expect(saveClientSession).toHaveBeenCalledWith({
        idToken: 'fake-id-token',
        refreshToken: 'fake-refresh-token'
      });
      
      expect(response.success).toBe(true);
      expect((response as any).data.redirectTo).toBe('/admin');
    });
  });
});
