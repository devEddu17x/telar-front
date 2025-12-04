import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AlertTriangle, ArrowLeft, ChevronRight, Home } from 'lucide-react'

import { getClothesWithVariants } from '@/modules/clothes/queries'
import { QUOTATION_STATUSES } from '@/modules/quotations/constants'
import { getQuotationById } from '@/modules/quotations/queries'
import { EditQuotationForm } from '@/modules/quotations/ui/components/edit-quotation-form'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

interface EditQuotationPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerEditQuotationPage({
  params
}: EditQuotationPageProps) {
  const { id } = await params
  const [quotation, clothes] = await Promise.all([
    getQuotationById(id),
    getClothesWithVariants()
  ])

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

  // If not pending, show warning
  if (quotation.status !== 'PENDING') {
    return (
      <div className='flex flex-1 flex-col gap-6 p-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/seller'>
                  <Home className='h-4 w-4' />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/seller/quotations'>Cotizaciones</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className='h-4 w-4' />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold tracking-tight'>
                Editar cotización
              </h1>
              {statusOption && (
                <Badge className={colorClasses[statusOption.color]}>
                  {statusOption.label}
                </Badge>
              )}
            </div>
            <p className='text-muted-foreground'>
              Cotización #{id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>No se puede editar</AlertTitle>
          <AlertDescription>
            Solo se pueden editar cotizaciones en estado pendiente. Esta
            cotización está en estado{' '}
            <strong>{statusOption?.label || quotation.status}</strong>.
          </AlertDescription>
        </Alert>

        <div className='flex gap-3'>
          <Button variant='outline' asChild>
            <Link href={`/seller/quotations/${id}`}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver al detalle
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/seller'>
                <Home className='h-4 w-4' />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className='h-4 w-4' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/seller/quotations'>Cotizaciones</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className='h-4 w-4' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/seller/quotations/${id}`}>Detalle</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className='h-4 w-4' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold tracking-tight'>
              Editar cotización
            </h1>
            {statusOption && (
              <Badge className={colorClasses[statusOption.color]}>
                {statusOption.label}
              </Badge>
            )}
          </div>
          <p className='text-muted-foreground'>
            Modifica los detalles de la cotización
          </p>
        </div>
      </div>

      <EditQuotationForm
        quotation={quotation}
        clothes={clothes}
        basePath='/seller/quotations'
      />
    </div>
  )
}
