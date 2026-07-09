import { useRouter } from 'next/navigation'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { signInClient } from '@/modules/auth/lib/auth-client'

import { SignInForm } from './sign-in-form'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/modules/auth/lib/auth-client', () => ({
  signInClient: jest.fn(),
  resendCodeClient: jest.fn()
}))

describe('SignInForm', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('debería llamar a signInClient y redirigir en caso de éxito', async () => {
    ;(signInClient as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { redirectTo: '/admin/dashboard' }
    })

    const user = userEvent.setup()

    render(<SignInForm />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitBtn = screen.getByRole('button', { name: /ingresar/i })

    await user.type(emailInput, 'test@test.com')
    await user.type(passwordInput, 'Password123!')
    await user.click(submitBtn)

    await waitFor(() => {
      expect(signInClient).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password123!'
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/admin/dashboard')
  })
})
