import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, Edit } from 'lucide-react'

import { CreateOrderDialog } from '@/modules/orders/ui/components'
import { QUOTATION_STATUSES } from '@/modules/quotations/constants'
import { getQuotationById } from '@/modules/quotations/queries'
import { CancelQuotationDialog } from '@/modules/quotations/ui/components/cancel-quotation-dialog'
import { QuotationDetail } from '@/modules/quotations/ui/components/quotation-detail'

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

interface QuotationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerQuotationDetailPage({
  params
}: QuotationDetailPageProps) {
  const { id } = await params
  const quotation = await getQuotationById(id)

  if (!quotation) {
    notFound()
  }

  const statusOption = QUOTATION_STATUSES.find(
    s => s.value === quotation.status
  )

  const colorClasses = {
    yellow:
      'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
    green:
      'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/seller'>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/seller/quotations'>
              Cotizaciones
            </BreadcrumbLink>
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
                Cotización #{id.slice(0, 8)}...
              </h1>
              {statusOption && (
                <Badge className={colorClasses[statusOption.color]}>
                  {statusOption.label}
                </Badge>
              )}
            </div>
            <p className='text-muted-foreground'>
              Detalle completo de la cotización
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link href='/seller/quotations'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver
            </Link>
          </Button>
          {quotation.status === 'PENDING' && (
            <>
              <CreateOrderDialog
                quoteId={id}
                quotationCode={id.slice(0, 8)}
                basePath='/seller/orders'
              />
              <Button asChild>
                <Link href={`/seller/quotations/${id}/edit`}>
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </Link>
              </Button>
              <CancelQuotationDialog quotationId={id} />
            </>
          )}
        </div>
      </div>

      <QuotationDetail quotation={quotation} ordersBasePath='/seller/orders' />
    </div>
  )
}
