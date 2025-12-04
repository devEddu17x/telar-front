import { Package } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

import type { CatalogClothes } from '../../types'
import { CatalogCard } from './catalog-card'

interface CatalogGridProps {
  clothes: CatalogClothes[]
}

export function CatalogGrid({ clothes }: CatalogGridProps) {
  if (clothes.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant='icon'>
          <Package />
        </EmptyMedia>
        <EmptyTitle>No hay prendas disponibles</EmptyTitle>
        <EmptyDescription>
          Actualmente no hay prendas en el catálogo.
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5'>
      {clothes.map(item => (
        <CatalogCard key={item.id} clothes={item} />
      ))}
    </div>
  )
}
