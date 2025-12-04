'use client'

import { useCallback, useState, useTransition } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ImagePlus, Star, Trash2, Upload } from 'lucide-react'

import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import { addImages } from '@/modules/clothes/actions/add-images'
import { deleteImage } from '@/modules/clothes/actions/delete-image'
import type { ClothesImage } from '@/modules/clothes/types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../../constants'

interface EditImagesSectionProps {
  clothesId: string
  images: ClothesImage[]
}

interface NewImage {
  file: File
  preview: string
}

export function EditImagesSection({
  clothesId,
  images
}: EditImagesSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDragging, setIsDragging] = useState(false)
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      setError(null)

      Array.from(files).forEach(file => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setError('Solo se permiten imágenes PNG, JPG o WebP')
          return
        }

        if (file.size > MAX_IMAGE_SIZE) {
          setError('La imagen no debe superar 5MB')
          return
        }

        const preview = URL.createObjectURL(file)
        setNewImages(prev => [...prev, { file, preview }])
      })

      e.target.value = ''
    },
    []
  )

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files

    setError(null)

    Array.from(files).forEach(file => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Solo se permiten imágenes PNG, JPG o WebP')
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError('La imagen no debe superar 5MB')
        return
      }

      const preview = URL.createObjectURL(file)
      setNewImages(prev => [...prev, { file, preview }])
    })
  }, [])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => {
      const image = prev[index]
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDeleteClick = (url: string) => {
    setImageToDelete(url)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!imageToDelete) return

    startTransition(async () => {
      const result = await deleteImage(clothesId, imageToDelete)

      if (result.success) {
        toast.success('Imagen eliminada')
        router.refresh()
      } else {
        toast.error(result.error || 'Error al eliminar imagen')
      }

      setDeleteDialogOpen(false)
      setImageToDelete(null)
    })
  }

  const handleUploadNewImages = () => {
    if (newImages.length === 0) return

    startTransition(async () => {
      const imagesData = newImages.map(img => ({
        filename: img.file.name,
        contentType: img.file.type
      }))

      const result = await addImages(clothesId, imagesData)

      if (result.success && result.data?.preSignedPuts) {
        try {
          const uploadPromises = result.data.preSignedPuts.map(
            async (preSignedPut, index) => {
              const file = newImages[index]?.file
              if (!file) return

              const response = await fetch(preSignedPut.putUrl, {
                method: 'PUT',
                body: file,
                headers: preSignedPut.requiredHeaders
              })

              if (!response.ok) {
                throw new Error(`Failed to upload image ${index + 1}`)
              }
            }
          )

          await Promise.all(uploadPromises)

          // Limpiar previews
          newImages.forEach(img => URL.revokeObjectURL(img.preview))
          setNewImages([])

          toast.success('Imágenes subidas exitosamente')
          router.refresh()
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError)
          toast.error('Error al subir las imágenes')
        }
      } else {
        toast.error(result.error || 'Error al procesar las imágenes')
      }
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
          <CardDescription>
            {images.length} imagen{images.length !== 1 ? 'es' : ''} • La primera
            es la imagen principal
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Imágenes existentes */}
          {images.length > 0 && (
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4'>
              {images.map((image, index) => (
                <div
                  key={image.url}
                  className={cn(
                    'group relative overflow-hidden rounded-lg border transition-all',
                    index === 0 && 'ring-primary/50 col-span-2 ring-2'
                  )}
                >
                  <div
                    className={cn(
                      'relative',
                      index === 0 ? 'aspect-video' : 'aspect-square'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={`Imagen ${index + 1}`}
                      fill
                      className='object-cover'
                    />

                    {/* Overlay con acciones */}
                    <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteClick(image.url)}
                        className='h-8'
                        disabled={isPending}
                      >
                        <Trash2 className='mr-1 h-3 w-3' />
                        Eliminar
                      </Button>
                    </div>

                    {/* Badge principal */}
                    {index === 0 && (
                      <Badge className='bg-primary absolute top-2 left-2'>
                        <Star className='mr-1 h-3 w-3' />
                        Principal
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zona de drop para nuevas imágenes */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <input
              type='file'
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple
              onChange={handleFileChange}
              className='hidden'
              id='edit-images-upload'
            />
            <label
              htmlFor='edit-images-upload'
              className='flex cursor-pointer flex-col items-center gap-3'
            >
              <div
                className={cn(
                  'rounded-full p-3 transition-colors',
                  isDragging ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                {isDragging ? (
                  <Upload className='text-primary h-6 w-6' />
                ) : (
                  <ImagePlus className='text-muted-foreground h-6 w-6' />
                )}
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium'>
                  {isDragging
                    ? 'Suelta las imágenes aquí'
                    : 'Agregar más imágenes'}
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Arrastra o haz clic • PNG, JPG, WebP • Máx. 5MB
                </p>
              </div>
            </label>
          </div>

          {/* Preview de nuevas imágenes */}
          {newImages.length > 0 && (
            <div className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                {newImages.length} imagen{newImages.length !== 1 ? 'es' : ''}{' '}
                nueva{newImages.length !== 1 ? 's' : ''} por subir
              </p>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {newImages.map((image, index) => (
                  <div
                    key={image.preview}
                    className='group relative overflow-hidden rounded-lg border'
                  >
                    <div className='relative aspect-square'>
                      <Image
                        src={image.preview}
                        alt={`Nueva imagen ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          onClick={() => removeNewImage(index)}
                          className='h-8'
                        >
                          <Trash2 className='mr-1 h-3 w-3' />
                          Quitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleUploadNewImages}
                disabled={isPending}
                className='w-full'
              >
                {isPending ? (
                  <>
                    <Spinner className='mr-2 h-4 w-4' />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    Subir {newImages.length} imagen
                    {newImages.length !== 1 ? 'es' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error */}
          {error && <p className='text-destructive text-sm'>{error}</p>}
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isPending ? <Spinner className='mr-2 h-4 w-4' /> : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
