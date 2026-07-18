'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ImageOff, RefreshCw } from 'lucide-react'

import { detailPath } from '@/lib/routes'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { getClothesClient } from '../../lib/clothes-client'
import type { Clothes } from '../../types'

interface ClothesCollageProps {
  basePath?: string
}

function ClothesCollageSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
      {Array.from({ length: 16 }, (_, index) => (
        <Skeleton key={index} className='aspect-square rounded-md' />
      ))}
    </div>
  )
}

export function ClothesCollage({
  basePath = '/admin/clothes'
}: ClothesCollageProps) {
  const [clothes, setClothes] = useState<Clothes[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCurrent = true

    async function loadClothes() {
      setIsLoading(true)
      setError(null)

      const result = await getClothesClient()

      if (!isCurrent) return

      if (result.success) {
        setClothes(result.data ?? [])
      } else {
        setClothes([])
        setError(result.error || 'No se pudieron cargar las prendas')
      }

      setIsLoading(false)
    }

    void loadClothes()

    return () => {
      isCurrent = false
    }
  }, [reloadKey])

  if (isLoading) return <ClothesCollageSkeleton />

  if (error) {
    return (
      <div className='flex min-h-48 flex-col items-center justify-center gap-3 text-center'>
        <p className='text-muted-foreground text-sm'>{error}</p>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => setReloadKey(key => key + 1)}
        >
          <RefreshCw className='h-4 w-4' />
          Reintentar
        </Button>
      </div>
    )
  }

  if (clothes.length === 0) {
    return (
      <div className='flex min-h-48 items-center justify-center'>
        <p className='text-muted-foreground text-sm'>
          No hay prendas registradas
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'>
      {clothes.map(item => {
        const image = item.clothe_image?.[0]

        return (
          <Link
            key={item.id}
            href={detailPath(basePath, item.id)}
            aria-label={`Ver detalle de ${item.name}`}
            className='bg-muted focus-visible:ring-ring relative aspect-square overflow-hidden rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          >
            {image ? (
              <Image
                src={image.url}
                alt={item.name}
                fill
                sizes='(min-width: 1280px) 12vw, (min-width: 1024px) 16vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw'
                className='object-cover transition-transform duration-200 hover:scale-105'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <ImageOff className='text-muted-foreground h-6 w-6' />
              </div>
            )}
            <div className='absolute right-0 bottom-0 left-0 bg-black/70 px-2 py-1.5 text-white'>
              <p className='truncate text-xs font-medium'>{item.name}</p>
              <p className='text-xs text-white/80'>
                S/ {Number(item.price).toFixed(2)}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
