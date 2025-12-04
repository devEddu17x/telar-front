'use client'

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

import { GENDER_LABELS } from '../../constants'
import type { ClothesVariant } from '../../types'

interface VariantSelectorProps {
  variants: ClothesVariant[]
  basePrice: number
  onVariantSelect: (variant: ClothesVariant | null) => void
  selectedVariant: ClothesVariant | null
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price)
}

function getInitialVariant(variants: ClothesVariant[]): {
  gender: string
  size: string
  variant: ClothesVariant | null
} {
  if (variants.length === 0) {
    return { gender: '', size: '', variant: null }
  }

  const genders = Array.from(new Set(variants.map(v => v.gender.gender)))
  const firstGender = genders[0]

  const sizesForGender = variants
    .filter(v => v.gender.gender === firstGender)
    .sort((a, b) => {
      const aNum = parseInt(a.size.size)
      const bNum = parseInt(b.size.size)
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
      return a.size.size.localeCompare(b.size.size)
    })

  const firstSize = sizesForGender[0]?.size.size || ''
  const variant =
    variants.find(
      v => v.gender.gender === firstGender && v.size.size === firstSize
    ) || null

  return { gender: firstGender, size: firstSize, variant }
}

export function VariantSelector({
  variants,
  basePrice,
  onVariantSelect
}: VariantSelectorProps) {
  const initialState = useMemo(() => getInitialVariant(variants), [variants])
  const hasCalledInitial = useRef(false)

  const [selectedGender, setSelectedGender] = useState<string>(
    initialState.gender
  )
  const [selectedSize, setSelectedSize] = useState<string>(initialState.size)
  const [currentVariant, setCurrentVariant] = useState<ClothesVariant | null>(
    initialState.variant
  )

  // Agrupar géneros disponibles
  const availableGenders = useMemo(() => {
    const genders = new Set(variants.map(v => v.gender.gender))
    return Array.from(genders)
  }, [variants])

  // Obtener tallas disponibles para el género seleccionado
  const availableSizes = useMemo(() => {
    if (!selectedGender) return []
    return variants
      .filter(v => v.gender.gender === selectedGender)
      .sort((a, b) => {
        const aNum = parseInt(a.size.size)
        const bNum = parseInt(b.size.size)
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
        return a.size.size.localeCompare(b.size.size)
      })
  }, [variants, selectedGender])

  // Encontrar variante seleccionada
  const findVariant = useCallback(
    (gender: string, size: string): ClothesVariant | null => {
      return (
        variants.find(
          v => v.gender.gender === gender && v.size.size === size
        ) || null
      )
    },
    [variants]
  )

  // Notificar variante inicial solo una vez
  useLayoutEffect(() => {
    if (!hasCalledInitial.current && initialState.variant) {
      hasCalledInitial.current = true
      onVariantSelect(initialState.variant)
    }
  }, [initialState.variant, onVariantSelect])

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender)
    // Obtener tallas del nuevo género
    const sizesForGender = variants
      .filter(v => v.gender.gender === gender)
      .sort((a, b) => {
        const aNum = parseInt(a.size.size)
        const bNum = parseInt(b.size.size)
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
        return a.size.size.localeCompare(b.size.size)
      })
    if (sizesForGender.length > 0) {
      const firstSize = sizesForGender[0].size.size
      setSelectedSize(firstSize)
      const variant = findVariant(gender, firstSize)
      setCurrentVariant(variant)
      onVariantSelect(variant)
    }
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
    const variant = findVariant(selectedGender, size)
    setCurrentVariant(variant)
    onVariantSelect(variant)
  }

  // Calcular precio total
  const totalPrice = currentVariant
    ? basePrice + parseFloat(currentVariant.additional)
    : basePrice

  const additionalPrice = currentVariant
    ? parseFloat(currentVariant.additional)
    : 0

  return (
    <div className='space-y-6'>
      {/* Selector de Género */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Género</Label>
        <div className='flex flex-wrap gap-2'>
          {availableGenders.map(gender => (
            <button
              key={gender}
              type='button'
              onClick={() => handleGenderChange(gender)}
              className={cn(
                'relative rounded-full border px-5 py-2 text-sm font-medium transition-all',
                selectedGender === gender
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input hover:border-primary hover:bg-accent'
              )}
            >
              {GENDER_LABELS[gender] || gender}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Talla */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium'>Talla</Label>
        <div className='flex flex-wrap gap-2'>
          {availableSizes.map(variant => {
            const isSelected = selectedSize === variant.size.size

            return (
              <button
                key={variant.id}
                type='button'
                onClick={() => handleSizeChange(variant.size.size)}
                className={cn(
                  'relative flex min-w-14 items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:border-primary hover:bg-accent'
                )}
              >
                {variant.size.size}
                {isSelected && (
                  <Check className='bg-primary absolute -top-1 -right-1 size-4 rounded-full p-0.5' />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Precio */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <div className='flex items-baseline justify-between'>
          <span className='text-muted-foreground text-sm'>Precio total</span>
          <div className='flex items-baseline gap-2'>
            {additionalPrice > 0 && (
              <Badge variant='secondary' className='text-xs'>
                +{formatPrice(additionalPrice)}
              </Badge>
            )}
            <span className='text-2xl font-bold'>
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
