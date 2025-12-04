import 'server-only'

import { fetchWithAuth } from '@/lib/fetch'

import type { Order, OrderStatus, OrderWithDetails } from './types'

interface GetOrdersParams {
  status?: OrderStatus
}

export async function getOrders(params?: GetOrdersParams): Promise<Order[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.status) {
      searchParams.set('status', params.status)
    }

    const query = searchParams.toString()
    const url = query ? `/orders?${query}` : '/orders'

    const data = await fetchWithAuth<Order[]>(url)
    return data
  } catch {
    return []
  }
}

export async function getOrderById(
  id: string
): Promise<OrderWithDetails | null> {
  try {
    const data = await fetchWithAuth<OrderWithDetails>(`/orders/${id}`)
    return data
  } catch {
    return null
  }
}
