import { QuickCreateClothesForm } from '@/modules/clothes/ui/components/quick-create-clothes-form'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function SellerQuickCreateClothesPage() {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='/seller/clothes'>Prendas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Creación rápida</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Creación rápida</h1>
          <p className='text-muted-foreground'>
            Crea un borrador de prenda para cotización rápida de diseños
            personalizados.
          </p>
        </div>
        <QuickCreateClothesForm basePath='/seller/clothes' />
      </div>
    </>
  )
}
