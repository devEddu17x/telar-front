import { useRouter } from 'next/navigation'

import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createOrderClient } from '@/modules/orders/lib/orders-client'

import { CreateOrderDialog } from './create-order-dialog'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/modules/orders/lib/orders-client', () => ({
  createOrderClient: jest.fn()
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

describe('CreateOrderDialog', () => {
  const mockRefresh = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
      push: mockPush
    })
  })

  it('debería mostrar errores de validación si se envía vacío', async () => {
    const user = userEvent.setup()

    render(<CreateOrderDialog quoteId='q1' quotationCode='Q-001' />)

    await user.click(screen.getByRole('button', { name: /Generar orden/i }))

    const dialog = screen.getByRole('dialog')
    const submitBtn = within(dialog).getByRole('button', {
      name: 'Crear orden',
      hidden: true
    })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText('La fecha de entrega es requerida')
      ).toBeInTheDocument()
      expect(
        screen.getByText('El departamento es requerido')
      ).toBeInTheDocument()
    })
  })
})
