import { notFound } from 'next/navigation'

import { getClothesById } from '@/modules/clothes/queries'
import { EditClothesForm } from '@/modules/clothes/ui/components/edit-clothes-form'
import { EditImagesSection } from '@/modules/clothes/ui/components/edit-images-section'
import { EditVariantsSection } from '@/modules/clothes/ui/components/edit-variants-section'

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

interface EditClothesPageProps {
  params: Promise<{ id: string }>
}

export default async function EditClothesPage({
  params
}: EditClothesPageProps) {
  const { id } = await params
  const clothes = await getClothesById(id)

  if (!clothes) {
    notFound()
  }

  const basePrice = parseFloat(clothes.price)

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
                <BreadcrumbLink href='/admin/clothes'>Prendas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar prenda</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold tracking-tight'>Editar prenda</h1>
          <p className='text-muted-foreground'>
            Modifica los datos de la prenda &quot;{clothes.name}&quot;.
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Columna izquierda - Imágenes */}
          <div className='lg:col-span-1'>
            <EditImagesSection
              clothesId={clothes.id}
              images={clothes.clothe_image ?? []}
            />
          </div>

          {/* Columna derecha - Información y variantes */}
          <div className='space-y-6 lg:col-span-2'>
            <EditClothesForm clothes={clothes} />
            <EditVariantsSection
              clothesId={clothes.id}
              variants={clothes.clothes_variant ?? []}
              basePrice={basePrice}
            />
          </div>
        </div>
      </div>
    </>
  )
}
