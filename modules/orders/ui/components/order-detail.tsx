'use client'

import { CalendarIcon, MapPinIcon, Phone, ShirtIcon, User } from 'lucide-react'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { ORDER_STATUSES } from '@/modules/orders/constants'
import type { OrderWithDetails } from '@/modules/orders/types'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface OrderDetailProps {
  order: OrderWithDetails
}

export function OrderDetail({ order }: OrderDetailProps) {
  const customer = order.quote.customer
  const details = order.quote.details

  // Calcular totales
  const totalClothes = new Set(details.map(d => d.clothesVariant.clothesId))
    .size
  const totalUnits = details.reduce((acc, d) => acc + d.quantity, 0)

  function formatPrice(price: string | number) {
    return `S/ ${Number(price).toFixed(2)}`
  }

  function getStatusBadge(status: OrderWithDetails['status']) {
    const statusOption = ORDER_STATUSES[status]
    if (!statusOption) return null

    return <Badge variant={statusOption.variant}>{statusOption.label}</Badge>
  }

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {/* Columna izquierda - Información principal */}
      <div className='space-y-6 md:col-span-2'>
        {/* Información de la orden */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la orden</CardTitle>
            <CardDescription>Datos generales del pedido</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm'>ID de la orden</p>
                <p className='font-mono text-sm'>{order.id}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  ID de cotización
                </p>
                <p className='font-mono text-sm'>{order.quoteId}</p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Estado</p>
                <div className='mt-1'>{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>
                  Fecha de creación
                </p>
                <p className='font-medium'>
                  {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", {
                    locale: es
                  })}
                </p>
              </div>
            </div>

            {order.status === 'CANCELLED' && order.cancellationReason && (
              <>
                <Separator />
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Motivo de cancelación
                  </p>
                  <p className='text-destructive font-medium'>
                    {order.cancellationReason}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detalle de prendas */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ShirtIcon className='h-5 w-5' />
              Detalle de prendas
            </CardTitle>
            <CardDescription>Prendas incluidas en la orden</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prenda</TableHead>
                  <TableHead className='text-center'>Cantidad</TableHead>
                  <TableHead className='text-right'>Precio unit.</TableHead>
                  <TableHead className='text-right'>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map(detail => {
                  const subtotal = Number(detail.unitPrice) * detail.quantity
                  return (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <p className='font-medium'>
                          {detail.clothesVariant.clothes.name}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          ID: {detail.clothesVariantId.slice(0, 8)}...
                        </p>
                      </TableCell>
                      <TableCell className='text-center'>
                        {detail.quantity}
                      </TableCell>
                      <TableCell className='text-right'>
                        {formatPrice(detail.unitPrice)}
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        {formatPrice(subtotal)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dirección de entrega */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPinIcon className='h-5 w-5' />
              Dirección de entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p className='font-medium'>{order.address.street}</p>
              <p className='text-muted-foreground'>
                {order.address.district}, {order.address.city}
              </p>
              <p className='text-muted-foreground'>
                {order.address.department}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna derecha - Resumen */}
      <div className='space-y-6'>
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <p className='font-medium'>
                {customer.names} {customer.lastNames}
              </p>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Phone className='text-muted-foreground h-4 w-4' />
              <span>{customer.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Fecha de entrega */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5' />
              Fecha de entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>
              {format(new Date(order.deliveryDate), "d 'de' MMMM", {
                locale: es
              })}
            </p>
            <p className='text-muted-foreground'>
              {format(new Date(order.deliveryDate), 'yyyy', { locale: es })}
            </p>
          </CardContent>
        </Card>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Prendas</span>
              <span className='font-medium'>{totalClothes}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Unidades</span>
              <span className='font-medium'>{totalUnits}</span>
            </div>
            <Separator />
            <div className='flex justify-between'>
              <span className='font-medium'>Total</span>
              <span className='text-xl font-bold'>
                {formatPrice(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
