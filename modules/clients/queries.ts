import 'server-only'

import { fetchWithAuth } from '@/lib/fetch'

import type { Client } from './types'

export async function getClients(): Promise<Client[]> {
  try {
    const data = await fetchWithAuth<Client[]>('/customers')
    return data
  } catch {
    return []
  }
}

export interface SearchClientsParams {
  names?: string
  lastnames?: string
  phone?: string
}

export async function searchClients(
  params: SearchClientsParams
): Promise<Client[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params.names) searchParams.set('names', params.names)
    if (params.lastnames) searchParams.set('lastnames', params.lastnames)
    if (params.phone) searchParams.set('phone', params.phone)

    const data = await fetchWithAuth<Client[]>(
      `/customers/search?${searchParams.toString()}`
    )
    return data
  } catch {
    return []
  }
}
