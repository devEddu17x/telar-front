import { useRouter } from 'next/navigation'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

import { createQuotationClient } from '@/modules/quotations/lib/quotations-client'

import { CreateQuotationForm } from './create-quotation-form'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/modules/quotations/lib/quotations-client', () => ({
  createQuotationClient: jest.fn()
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

jest.mock('./client-selector', () => ({
  ClientSelector: ({ onChange }: any) => (
    <button onClick={() => onChange('c1')}>Seleccionar Cliente Mock</button>
  )
}))

jest.mock('./quotation-items-field', () => ({
  QuotationItemsField: () => (
    <div data-testid='items-field'>Mock Items Field</div>
  )
}))

describe('CreateQuotationForm', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      back: jest.fn()
    })
  })

  it('no permite submit si faltan campos (zod validación simulada indirectamente)', async () => {
    const user = userEvent.setup()

    render(<CreateQuotationForm clients={[]} clothes={[]} />)

    await user.click(screen.getByText('Seleccionar Cliente Mock'))

    const submitBtn = screen.getByRole('button', { name: /Crear cotización/i })

    expect(submitBtn).toBeDisabled()
  })
})
