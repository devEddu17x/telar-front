'use client'

import { useCallback, useState } from 'react'

import Image from 'next/image'

import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'

import { useFieldArray, useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../../constants'
import type { ImageFileInput } from '../../schemas'

interface FormWithImages {
  images: ImageFileInput[]
}

export function ImagesUpload() {
  const form = useFormContext<FormWithImages>()
  const [isDragging, setIsDragging] = useState(false)

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'images'
  })

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      form.clearErrors('images')

      Array.from(files).forEach(file => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          form.setError('images', {
            type: 'manual',
            message: 'Solo se permiten imágenes PNG, JPG o WebP'
          })
          return
        }

        if (file.size > MAX_IMAGE_SIZE) {
          form.setError('images', {
            type: 'manual',
            message: 'La imagen no debe superar 5MB'
          })
          return
        }

        const preview = URL.createObjectURL(file)
        append({ file, preview })
      })

      e.target.value = ''
    },
    [append, form]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const files = e.dataTransfer.files

      form.clearErrors('images')

      Array.from(files).forEach(file => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          form.setError('images', {
            type: 'manual',
            message: 'Solo se permiten imágenes PNG, JPG o WebP'
          })
          return
        }

        if (file.size > MAX_IMAGE_SIZE) {
          form.setError('images', {
            type: 'manual',
            message: 'La imagen no debe superar 5MB'
          })
          return
        }

        const preview = URL.createObjectURL(file)
        append({ file, preview })
      })
    },
    [append, form]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const setAsPrimary = (index: number) => {
    if (index !== 0) {
      move(index, 0)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Zona de drag & drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input
          type='file'
          accept='image/png,image/jpeg,image/webp'
          multiple
          onChange={handleFileChange}
          className='hidden'
          id='images-upload'
        />
        <label
          htmlFor='images-upload'
          className='flex cursor-pointer flex-col items-center gap-3'
        >
          <div
            className={cn(
              'rounded-full p-4 transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            {isDragging ? (
              <Upload className='text-primary h-8 w-8' />
            ) : (
              <ImagePlus className='text-muted-foreground h-8 w-8' />
            )}
          </div>
          <div className='text-center'>
            <p className='font-medium'>
              {isDragging ? 'Suelta las imágenes aquí' : 'Subir imágenes'}
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Arrastra o haz clic • PNG, JPG, WebP • Máx. 5MB
            </p>
          </div>
        </label>
      </div>

      {/* Contador y grid de imágenes */}
      {fields.length > 0 && (
        <div className='space-y-3'>
          {/* Contador de imágenes */}
          <p className='text-muted-foreground text-sm'>
            {fields.length} imagen{fields.length !== 1 ? 'es' : ''} subida
            {fields.length !== 1 ? 's' : ''} • La primera será la imagen
            principal
          </p>

          {/* Grid de thumbnails */}
          <div className='grid grid-cols-4 gap-3'>
            {fields.map((field, index) => {
              const isPrimary = index === 0

              return (
                <div
                  key={field.id}
                  className={cn(
                    'group relative overflow-hidden rounded-lg border',
                    isPrimary && 'border-primary col-span-2 row-span-2'
                  )}
                >
                  <div className='relative aspect-square'>
                    <Image
                      src={field.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className='object-cover'
                    />

                    {/* Badge "Principal" solo en la primera imagen */}
                    {isPrimary && (
                      <Badge className='bg-primary absolute top-2 left-2'>
                        <Star className='mr-1 h-3 w-3' />
                        Principal
                      </Badge>
                    )}

                    {/* Overlay con botones (aparece en hover) */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
                        isPrimary ? 'gap-2' : 'gap-1'
                      )}
                    >
                      {/* Botón para establecer como principal (solo si no es la primera) */}
                      {!isPrimary && (
                        <Button
                          type='button'
                          variant='secondary'
                          size='icon'
                          onClick={() => setAsPrimary(index)}
                          title='Establecer como principal'
                          className='h-8 w-8'
                        >
                          <Star className='h-4 w-4' />
                        </Button>
                      )}

                      {/* Botón para eliminar */}
                      <Button
                        type='button'
                        variant='destructive'
                        size={isPrimary ? 'sm' : 'icon'}
                        onClick={() => {
                          URL.revokeObjectURL(field.preview)
                          remove(index)
                        }}
                        title='Eliminar imagen'
                        className={isPrimary ? '' : 'h-8 w-8'}
                      >
                        <Trash2
                          className={isPrimary ? 'mr-1 h-4 w-4' : 'h-4 w-4'}
                        />
                        {isPrimary && 'Eliminar'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Errores */}
      {form.formState.errors.images?.message && (
        <p className='text-destructive text-sm'>
          {form.formState.errors.images.message}
        </p>
      )}
      {form.formState.errors.images?.root && (
        <p className='text-destructive text-sm'>
          {form.formState.errors.images.root.message}
        </p>
      )}
    </div>
  )
}
