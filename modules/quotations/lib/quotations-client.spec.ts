import { apiRequest } from '@/lib/api/client'

import { getFreshClientIdToken } from '@/modules/auth/lib/session-client'

import { createQuotationClient } from './quotations-client'

jest.mock('@/lib/api/client', () => ({
  apiRequest: jest.fn(),
  ApiError: class extends Error {
    status: number
    body: unknown
    constructor(status: number, message: string, body: unknown) {
      super(message)
      this.status = status
      this.body = body
    }
  }
}))

jest.mock('@/modules/auth/lib/session-client', () => ({
  getFreshClientIdToken: jest.fn()
}))

describe('Quotations Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getFreshClientIdToken as jest.Mock).mockResolvedValue('fake-token')
  })

  describe('createQuotationClient', () => {
    it('debería crear la cotización exitosamente', async () => {
      const mockResponse = { id: '1' }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await createQuotationClient({
        customerId: '123e4567-e89b-12d3-a456-426614174000',
        details: [
          {
            clothesVariantId: '123e4567-e89b-12d3-a456-426614174001',
            quantity: 1,
            customizations: []
          }
        ]
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)

      expect(apiRequest).toHaveBeenCalledWith('/quotes', {
        method: 'POST',
        token: 'fake-token',
        body: expect.any(Object)
      })
    })
  })
})
