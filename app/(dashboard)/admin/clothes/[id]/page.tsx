import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ChevronRight, Home } from 'lucide-react'

import { getClothesById } from '@/modules/clothes/queries'
import { ClothesDetail } from '@/modules/clothes/ui/components/clothes-detail'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

interface ClothesDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ClothesDetailPage({
  params
}: ClothesDetailPageProps) {
  const { id } = await params
  const clothes = await getClothesById(id)

  if (!clothes) {
    notFound()
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/admin'>
                <Home className='h-4 w-4' />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className='h-4 w-4' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/admin/clothes'>Prendas</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className='h-4 w-4' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{clothes.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ClothesDetail clothes={clothes} />
    </div>
  )
}
