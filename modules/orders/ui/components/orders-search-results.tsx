import { getOrders } from '@/modules/orders/queries'
import type { OrderStatus } from '@/modules/orders/types'

import { OrdersTable } from './orders-table'

interface OrdersSearchResultsProps {
  searchParams: {
    status?: string
    sortBy?: string
    sortOrder?: string
  }
  basePath?: string
}

export async function OrdersSearchResults({
  searchParams,
  basePath = '/admin/orders'
}: OrdersSearchResultsProps) {
  const status = searchParams.status as OrderStatus | undefined

  let orders = await getOrders({ status })

  // Ordenamiento client-side
  const sortBy = searchParams.sortBy as
    | 'createdAt'
    | 'deliveryDate'
    | 'total'
    | undefined
  const sortOrder = searchParams.sortOrder as 'asc' | 'desc' | undefined

  if (sortBy) {
    orders = [...orders].sort((a, b) => {
      let comparison = 0

      if (sortBy === 'createdAt') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'deliveryDate') {
        comparison =
          new Date(a.deliveryDate).getTime() -
          new Date(b.deliveryDate).getTime()
      } else if (sortBy === 'total') {
        comparison = Number(a.total) - Number(b.total)
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const hasFilters = Boolean(searchParams.status)

  return (
    <OrdersTable orders={orders} hasFilters={hasFilters} basePath={basePath} />
  )
}
