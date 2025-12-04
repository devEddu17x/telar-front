'use client'

import { useState } from 'react'

import Image from 'next/image'

import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ClothesImageGalleryProps {
  images: { url: string }[]
}

export function ClothesImageGallery({ images }: ClothesImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className='bg-muted flex aspect-square w-full flex-col items-center justify-center rounded-lg'>
        <ImageOff className='text-muted-foreground h-16 w-16' />
        <p className='text-muted-foreground mt-2 text-sm'>Sin imágenes</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Main Image */}
      <div className='relative aspect-square w-full overflow-hidden rounded-lg border'>
        <Image
          src={images[selectedIndex].url}
          alt={`Imagen ${selectedIndex + 1}`}
          fill
          className='object-cover'
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images.map((image, index) => (
            <button
              key={image.url}
              type='button'
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-primary/20 ring-2'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
