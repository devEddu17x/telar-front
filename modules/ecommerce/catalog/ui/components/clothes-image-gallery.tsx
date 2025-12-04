'use client'

import { useState } from 'react'

import Image from 'next/image'

import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'

import { PLACEHOLDER_IMAGE } from '../../constants'

interface ClothesImageGalleryProps {
  images: { url: string }[]
}

export function ClothesImageGallery({ images }: ClothesImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className='bg-muted flex aspect-square w-full flex-col items-center justify-center rounded-lg'>
        <ImageOff className='text-muted-foreground size-16' />
        <p className='text-muted-foreground mt-2 text-sm'>Sin imágenes</p>
      </div>
    )
  }

  const currentImage = images[selectedIndex]?.url || PLACEHOLDER_IMAGE

  return (
    <div className='space-y-4'>
      {/* Imagen principal */}
      <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100'>
        <Image
          src={currentImage}
          alt={`Imagen ${selectedIndex + 1}`}
          fill
          className='object-cover'
          priority
          sizes='(max-width: 768px) 100vw, 50vw'
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <button
              key={image.url}
              type='button'
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative size-20 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-primary/20 ring-2'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={image.url}
                alt={`Miniatura ${index + 1}`}
                fill
                className='object-cover'
                sizes='80px'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
