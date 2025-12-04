import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { ORDER_STATUSES } from '@/modules/orders/constants'
import { getOrderById } from '@/modules/orders/queries'
import { CancelOrderDialog } from '@/modules/orders/ui/components/cancel-order-dialog'
import { CompleteOrderDialog } from '@/modules/orders/ui/components/complete-order-dialog'
import { OrderDetail } from '@/modules/orders/ui/components/order-detail'

import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
  params
}: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const statusOption = ORDER_STATUSES[order.status]

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/admin'>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/admin/orders'>Órdenes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold tracking-tight'>
                Orden #{id.slice(0, 8)}...
              </h1>
              {statusOption && (
                <Badge variant={statusOption.variant}>
                  {statusOption.label}
                </Badge>
              )}
            </div>
            <p className='text-muted-foreground'>
              Detalle completo de la orden
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link href='/admin/orders'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver
            </Link>
          </Button>
          {order.status === 'IN_PRODUCTION' && (
            <>
              <CancelOrderDialog orderId={id} />
              <CompleteOrderDialog orderId={id} />
            </>
          )}
        </div>
      </div>

      <OrderDetail order={order} />
    </div>
  )
}
