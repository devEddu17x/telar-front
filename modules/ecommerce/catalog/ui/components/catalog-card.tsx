'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { PLACEHOLDER_IMAGE } from '../../constants'
import type { CatalogClothes } from '../../types'

interface CatalogCardProps {
  clothes: CatalogClothes
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price)
}

export function CatalogCard({ clothes }: CatalogCardProps) {
  const images =
    clothes.images.length > 0 ? clothes.images : [{ url: PLACEHOLDER_IMAGE }]
  const hasMultipleImages = images.length > 1

  return (
    <article className='group flex flex-col'>
      {/* Imagen con Carousel */}
      <div className='relative aspect-12/8 overflow-hidden rounded-lg bg-gray-100 object-center'>
        {hasMultipleImages ? (
          <Carousel className='size-full'>
            <CarouselContent className='ml-0 h-full'>
              {images.map((image, index) => (
                <CarouselItem key={index} className='pl-0'>
                  <div className='relative aspect-square'>
                    <Image
                      src={image.url}
                      alt={`${clothes.name} - Imagen ${index + 1}`}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-2 size-8 opacity-0 transition-opacity group-hover:opacity-100' />
            <CarouselNext className='right-2 size-8 opacity-0 transition-opacity group-hover:opacity-100' />
          </Carousel>
        ) : (
          <Image
            src={images[0].url}
            alt={clothes.name}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
          />
        )}
      </div>

      {/* Contenido */}
      <div className='mt-4 flex flex-1 flex-col justify-between gap-y-4'>
        <div className='flex items-start justify-between gap-x-4'>
          <div className='space-y-1'>
            <h3 className='text-lg leading-tight font-bold'>{clothes.name}</h3>

            <p className='text-muted-foreground mt-1 line-clamp-3 text-xs'>
              {clothes.description}
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm font-bold'>
              {formatPrice(clothes.price)}
            </span>
          </div>
        </div>

        <Button variant='outline' size='sm' className='gap-1' asChild>
          <Link href={`/clothes/${clothes.id}`}>
            Ver detalle
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
    </article>
  )
}
