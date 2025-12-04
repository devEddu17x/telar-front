import { Suspense } from 'react'

import { searchClothes } from '@/modules/clothes/queries'
import type { SearchClothesParams } from '@/modules/clothes/types'

import { Skeleton } from '@/components/ui/skeleton'

import { ClothesTable } from './clothes-table'

interface ClothesSearchResultsProps {
  searchParams: SearchClothesParams & { q?: string; status?: string }
}

function ClothesTableSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-16 w-full' />
      <Skeleton className='h-16 w-full' />
      <Skeleton className='h-16 w-full' />
    </div>
  )
}

async function ClothesSearchResultsContent({
  searchParams
}: ClothesSearchResultsProps) {
  const { q, size, gender, status } = searchParams

  // Construir parámetros de búsqueda
  const params: SearchClothesParams = {}

  if (q) {
    params.name = q
    params.description = q
  }
  if (size) params.size = size
  if (gender) params.gender = gender

  // Manejar filtro de estado
  if (status === 'published') {
    params.isDraft = false
  } else if (status === 'draft') {
    params.isDraft = true
  }

  const hasFilters = Boolean(q || size || gender || status)

  // Si no hay filtros, obtener todas las prendas
  // Si hay filtros, buscar con los parámetros
  const clothes = hasFilters
    ? await searchClothes(params)
    : await searchClothes({})

  return <ClothesTable clothes={clothes} hasFilters={hasFilters} />
}

export function ClothesSearchResults({
  searchParams
}: ClothesSearchResultsProps) {
  return (
    <Suspense fallback={<ClothesTableSkeleton />}>
      <ClothesSearchResultsContent searchParams={searchParams} />
    </Suspense>
  )
}
