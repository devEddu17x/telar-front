import 'server-only'

import { fetchWithAuth } from '@/lib/fetch'

import type { Quotation, QuotationStatus, QuotationWithDetails } from './types'

interface GetQuotationsParams {
  status?: QuotationStatus
}

export async function getQuotations(
  params?: GetQuotationsParams
): Promise<Quotation[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.status) {
      searchParams.set('status', params.status)
    }

    const query = searchParams.toString()
    const url = query ? `/quotes?${query}` : '/quotes'

    const data = await fetchWithAuth<Quotation[]>(url)
    return data
  } catch {
    return []
  }
}

export async function getQuotationById(
  id: string
): Promise<QuotationWithDetails | null> {
  try {
    const data = await fetchWithAuth<QuotationWithDetails>(`/quotes/${id}`)
    return data
  } catch {
    return null
  }
}
