import { useRouter } from 'next/navigation'

import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SignInForm } from './sign-in-form'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  const mockSend = jest.fn()
  type MockClientType = jest.Mock & { mockSend?: jest.Mock }
  const MockClient = jest.fn().mockImplementation(() => ({
    send: mockSend
  })) as MockClientType
  MockClient.mockSend = mockSend

  class DummyError extends Error {}

  return {
    CognitoIdentityProviderClient: MockClient,
    InitiateAuthCommand: jest.fn(),
    AuthFlowType: { USER_PASSWORD_AUTH: 'USER_PASSWORD_AUTH' },
    NotAuthorizedException: DummyError,
    UserNotConfirmedException: DummyError
  }
})

jest.mock('jose', () => ({
  decodeJwt: jest.fn().mockReturnValue({
    sub: 'user-123',
    email: 'admin@empresa.com',
    'cognito:groups': ['admin'],
    'custom:tenant_id': 'tenant-1',
    exp: Math.floor(Date.now() / 1000) + 3600
  })
}))

describe('SignInForm Integration', () => {
  const mockPush = jest.fn()
  let mockCognitoSend: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: ''
    })
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    mockCognitoSend = (
      CognitoIdentityProviderClient as unknown as { mockSend: jest.Mock }
    ).mockSend
  })

  it('Flujo completo de autenticación: UI -> Zod -> Cognito -> LocalStorage -> Router', async () => {
    const user = userEvent.setup()

    mockCognitoSend.mockResolvedValueOnce({
      AuthenticationResult: {
        IdToken: 'real-id-token',
        RefreshToken: 'real-refresh-token'
      }
    })

    render(<SignInForm />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitBtn = screen.getByRole('button', { name: /ingresar/i })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText('El correo electrónico es obligatorio')
      ).toBeInTheDocument()
    })

    expect(mockCognitoSend).not.toHaveBeenCalled()

    await user.type(emailInput, 'admin@empresa.com')
    await user.type(passwordInput, 'Password123#')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(window.localStorage.getItem('telar.idToken')).toBe('real-id-token')
      expect(window.localStorage.getItem('telar.refreshToken')).toBe(
        'real-refresh-token'
      )
    })

    expect(mockPush).toHaveBeenCalledWith('/admin')
  })
})
