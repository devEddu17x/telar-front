import 'server-only'

import { fetchWithAuth } from '@/lib/fetch'

import type { Clothes, SearchClothesParams } from './types'

export async function getClothes(): Promise<Clothes[]> {
  try {
    const data = await fetchWithAuth<Clothes[]>('/clothes')
    return data
  } catch {
    return []
  }
}

export async function getClothesById(id: string): Promise<Clothes | null> {
  try {
    const data = await fetchWithAuth<Clothes>(`/clothes/${id}`)
    return data
  } catch {
    return null
  }
}

export async function getClothesWithVariants(): Promise<Clothes[]> {
  try {
    // Get all clothes
    const clothesList = await fetchWithAuth<Clothes[]>('/clothes')

    // For each clothes, get full details with variants
    const clothesWithVariants = await Promise.all(
      clothesList.map(async clothes => {
        try {
          const fullClothes = await fetchWithAuth<Clothes>(
            `/clothes/${clothes.id}`
          )
          return fullClothes
        } catch {
          return clothes
        }
      })
    )

    return clothesWithVariants
  } catch {
    return []
  }
}

export async function searchClothes(
  params: SearchClothesParams
): Promise<Clothes[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params.name) searchParams.set('name', params.name)
    if (params.description) searchParams.set('description', params.description)
    if (params.size) searchParams.set('size', params.size)
    if (params.gender) searchParams.set('gender', params.gender.toLowerCase())
    if (params.isDraft !== undefined)
      searchParams.set('isDraft', String(params.isDraft))
    if (params.isInEcommerce !== undefined)
      searchParams.set('isInEcommerce', String(params.isInEcommerce))

    const queryString = searchParams.toString()
    const url = queryString ? `/clothes/search?${queryString}` : '/clothes'

    const data = await fetchWithAuth<Clothes[]>(url)
    return data
  } catch {
    return []
  }
}
