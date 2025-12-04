'use client'

import { useState } from 'react'

import Link from 'next/link'

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Package,
  ShoppingCart,
  Truck
} from 'lucide-react'

import { toast } from 'sonner'

import { useCartStore } from '@/modules/ecommerce/cart/store'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CATALOG_ERROR_MESSAGES, PLACEHOLDER_IMAGE } from '../../constants'
import type { ClothesDetail, ClothesVariant } from '../../types'
import { ClothesImageGallery } from './clothes-image-gallery'
import { VariantSelector } from './variant-selector'

interface ClothesDetailViewProps {
  clothes: ClothesDetail
}

export function ClothesDetailView({ clothes }: ClothesDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ClothesVariant | null>(
    null
  )
  const addItem = useCartStore(state => state.addItem)
  const openCart = useCartStore(state => state.openCart)

  const basePrice = parseFloat(clothes.price)
  const isAvailable = clothes.isInEcommerce && !clothes.isDraft
  const hasVariants = clothes.clothes_variant.length > 0

  // Producto no disponible
  if (!isAvailable) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='size-4' />
          <AlertTitle>Producto no disponible</AlertTitle>
          <AlertDescription>
            {CATALOG_ERROR_MESSAGES.PRODUCT_UNAVAILABLE}
          </AlertDescription>
        </Alert>

        <Button variant='outline' asChild>
          <Link href='/'>
            <ArrowLeft className='mr-2 size-4' />
            Volver al catálogo
          </Link>
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Selecciona una variante', {
        description:
          'Debes seleccionar género y talla antes de añadir al carrito'
      })
      return
    }

    addItem({
      clothesId: clothes.id,
      clothesName: clothes.name,
      clothesImage: clothes.clothe_image[0]?.url || PLACEHOLDER_IMAGE,
      variantId: selectedVariant.id,
      size: selectedVariant.size.size,
      gender: selectedVariant.gender.gender,
      basePrice: basePrice,
      additionalPrice: parseFloat(selectedVariant.additional)
    })

    toast.success('Producto añadido', {
      description: `${clothes.name} (${selectedVariant.size.size}) se añadió al carrito`
    })

    openCart()
  }

  return (
    <div className='space-y-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-sm'>
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground transition-colors'
        >
          Catálogo
        </Link>
        <span className='text-muted-foreground'>/</span>
        <span className='font-medium'>{clothes.name}</span>
      </nav>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
        {/* Columna izquierda - Galería */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <ClothesImageGallery images={clothes.clothe_image} />
        </div>

        {/* Columna derecha - Información */}
        <div className='space-y-8'>
          {/* Header */}
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold tracking-tight'>
              {clothes.name}
            </h1>

            {/* Descripción */}
            {clothes.description && (
              <p className='text-muted-foreground text-lg leading-relaxed'>
                {clothes.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Selector de variantes */}
          {hasVariants ? (
            <VariantSelector
              variants={clothes.clothes_variant}
              basePrice={basePrice}
              onVariantSelect={setSelectedVariant}
              selectedVariant={selectedVariant}
            />
          ) : (
            <div className='space-y-2'>
              <p className='text-3xl font-bold'>
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                }).format(basePrice)}
              </p>
            </div>
          )}

          {/* Botón añadir al carrito */}
          <Button
            size='lg'
            className='h-14 w-full text-base'
            disabled={hasVariants && !selectedVariant}
            onClick={handleAddToCart}
          >
            <ShoppingCart className='mr-2 size-5' />
            Añadir al carrito
          </Button>

          {/* Beneficios */}
          <div className='grid grid-cols-1 gap-4 rounded-xl border p-4 sm:grid-cols-3'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex size-10 items-center justify-center rounded-full'>
                <Truck className='text-primary size-5' />
              </div>
              <div>
                <p className='text-sm font-medium'>Envío a La Libertad</p>
                <p className='text-muted-foreground text-xs'>
                  7-60 días hábiles
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex size-10 items-center justify-center rounded-full'>
                <Package className='text-primary size-5' />
              </div>
              <div>
                <p className='text-sm font-medium'>Calidad garantizada</p>
                <p className='text-muted-foreground text-xs'>Prendas premium</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex size-10 items-center justify-center rounded-full'>
                <Check className='text-primary size-5' />
              </div>
              <div>
                <p className='text-sm font-medium'>Compra segura</p>
                <p className='text-muted-foreground text-xs'>Pago protegido</p>
              </div>
            </div>
          </div>

          {/* Volver */}
          <Button variant='ghost' size='sm' asChild>
            <Link href='/'>
              <ArrowLeft className='mr-2 size-4' />
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
