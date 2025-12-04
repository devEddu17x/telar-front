import { getQuotations } from '@/modules/quotations/queries'
import type { QuotationStatus } from '@/modules/quotations/types'

import { QuotationsTable } from './quotations-table'

interface QuotationsSearchResultsProps {
  searchParams: {
    status?: string
    sortBy?: string
    sortOrder?: string
  }
  basePath?: string
}

export async function QuotationsSearchResults({
  searchParams,
  basePath = '/admin/quotations'
}: QuotationsSearchResultsProps) {
  const status = searchParams.status as QuotationStatus | undefined

  let quotations = await getQuotations({ status })

  // Ordenamiento client-side
  const sortBy = searchParams.sortBy as 'createdAt' | 'total' | undefined
  const sortOrder = searchParams.sortOrder as 'asc' | 'desc' | undefined

  if (sortBy) {
    quotations = [...quotations].sort((a, b) => {
      let comparison = 0

      if (sortBy === 'createdAt') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'total') {
        comparison = Number(a.total) - Number(b.total)
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const hasFilters = Boolean(searchParams.status)

  return (
    <QuotationsTable
      quotations={quotations}
      hasFilters={hasFilters}
      basePath={basePath}
    />
  )
}
