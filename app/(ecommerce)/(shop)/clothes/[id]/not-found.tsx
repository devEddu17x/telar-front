import Link from 'next/link'

import { PackageX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

export default function ClothesNotFound() {
  return (
    <div className='container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8'>
      <Empty>
        <EmptyMedia variant='icon'>
          <PackageX />
        </EmptyMedia>
        <EmptyTitle>Producto no encontrado</EmptyTitle>
        <EmptyDescription>
          El producto que buscas no existe o no está disponible.
        </EmptyDescription>
        <Button asChild className='mt-4'>
          <Link href='/'>Volver al catálogo</Link>
        </Button>
      </Empty>
    </div>
  )
}
