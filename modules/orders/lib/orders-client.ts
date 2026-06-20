'use client'

import { ApiError, apiRequest } from '@/lib/api/client'

import { getClientIdToken } from '@/modules/auth/lib/session-client'
import type { ActionResponse } from '@/modules/auth/types'

import { cancelOrderSchema } from '../schemas'
import type { CreateOrderInput, Order, OrderStatus } from '../types'

function getAuthenticatedTokenResponse() {
  const idToken = getClientIdToken()

  if (!idToken) {
    return { success: false, error: 'No session' } as const
  }

  return { success: true, idToken } as const
}

function getOrderErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) return fallback

  if (error.status === 404) return 'Orden no encontrada'

  return error.message || fallback
}

export async function createOrderClient(
  input: CreateOrderInput
): Promise<ActionResponse<Order>> {
  const auth = getAuthenticatedTokenResponse()

  if (!auth.success) {
    return { success: false, error: auth.error }
  }

  try {
    const data = await apiRequest<Order>('/orders', {
      method: 'POST',
      token: auth.idToken,
      body: input
    })

    return { success: true, data }
  } catch (error) {
    console.error('Create order error:', error)

    if (error instanceof ApiError && error.status === 404) {
      return { success: false, error: 'Cotización no encontrada' }
    }

    return {
      success: false,
      error: getOrderErrorMessage(
        error,
        'No se puede generar la orden. Verifica que la cotización esté pendiente.'
      )
    }
  }
}

export async function updateOrderStatusClient(
  id: string,
  status: OrderStatus
): Promise<ActionResponse<Order>> {
  const auth = getAuthenticatedTokenResponse()

  if (!auth.success) {
    return { success: false, error: auth.error }
  }

  try {
    const data = await apiRequest<Order>(`/orders/${id}`, {
      method: 'PATCH',
      token: auth.idToken,
      body: { status }
    })

    return { success: true, data }
  } catch (error) {
    console.error('Update order status error:', error)
    return {
      success: false,
      error: getOrderErrorMessage(
        error,
        'No se puede cambiar el estado de la orden. Verifica que esté en producción.'
      )
    }
  }
}

export async function cancelOrderClient(
  id: string,
  reason: string
): Promise<ActionResponse<Order>> {
  const validated = cancelOrderSchema.safeParse({ reason })

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'Motivo inválido'
    }
  }

  const auth = getAuthenticatedTokenResponse()

  if (!auth.success) {
    return { success: false, error: auth.error }
  }

  try {
    const data = await apiRequest<Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
      token: auth.idToken,
      body: validated.data
    })

    return { success: true, data }
  } catch (error) {
    console.error('Cancel order error:', error)
    return {
      success: false,
      error: getOrderErrorMessage(
        error,
        'No se puede cancelar la orden. Verifica que esté en producción.'
      )
    }
  }
}
