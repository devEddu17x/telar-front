import { apiRequest } from '@/lib/api/client'

import { getFreshClientIdToken } from '@/modules/auth/lib/session-client'

import {
  cancelOrderClient,
  createOrderClient,
  updateOrderStatusClient
} from './orders-client'

jest.mock('@/lib/api/client', () => {
  return {
    apiRequest: jest.fn(),
    ApiError: class extends Error {
      status: number
      body: unknown
      constructor(status: number, message: string, body: unknown = null) {
        super(message)
        this.status = status
        this.body = body
        this.name = 'ApiError'
      }
    }
  }
})

jest.mock('@/modules/auth/lib/session-client', () => ({
  getFreshClientIdToken: jest.fn()
}))

const mockToken = 'fake-id-token'

describe('Orders Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getFreshClientIdToken as jest.Mock).mockResolvedValue(mockToken)
  })

  describe('createOrderClient', () => {
    const mockInput = {
      quoteId: 'q1',
      deliveryDate: '2023-12-01T00:00:00Z',
      address: {
        department: 'Lima',
        city: 'Lima',
        district: 'Miraflores',
        street: 'Av. Larco 123'
      }
    }

    it('debería crear una orden exitosamente', async () => {
      const mockOrder = { id: 'o1' }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockOrder)

      const result = await createOrderClient(mockInput)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockOrder)

      expect(apiRequest).toHaveBeenCalledWith(
        '/orders',
        expect.objectContaining({
          method: 'POST',
          body: mockInput
        })
      )
    })
  })

  describe('updateOrderStatusClient', () => {
    it('debería actualizar el estado de una orden', async () => {
      const mockOrder = { id: '1', status: 'DONE' }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockOrder)

      const result = await updateOrderStatusClient('1', 'DONE')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockOrder)
      expect(apiRequest).toHaveBeenCalledWith(
        '/orders/1',
        expect.objectContaining({
          method: 'PATCH',
          body: { status: 'DONE' }
        })
      )
    })
  })

  describe('cancelOrderClient', () => {
    it('debería fallar si la razón es muy corta', async () => {
      const result = await cancelOrderClient('1', 'ab')

      expect(result.success).toBe(false)

      expect(result.error).toBe('El motivo debe tener al menos 10 caracteres')
    })
  })
})
