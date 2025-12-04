'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Check, ImageOff, Plus } from 'lucide-react'

import type { Clothes, ClothesVariant } from '@/modules/clothes/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface SelectedVariantInfo {
  clothesId: string
  clothesName: string
  clothesImage: string | null
  variantId: string
  size: string
  gender: string
  basePrice: number
  additionalPrice: number
  unitPrice: number
}

interface ClothesVariantSelectorProps {
  clothes: Clothes[]
  onSelect: (items: SelectedVariantInfo[]) => void
  disabled?: boolean
  excludeVariantIds?: string[]
}

export function ClothesVariantSelector({
  clothes,
  onSelect,
  disabled = false,
  excludeVariantIds = []
}: ClothesVariantSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedClothes, setSelectedClothes] = useState<Clothes | null>(null)
  const [step, setStep] = useState<'clothes' | 'variant'>('clothes')
  const [selectedVariants, setSelectedVariants] = useState<
    Map<string, SelectedVariantInfo>
  >(new Map())

  // Filter only published clothes (not draft)
  const availableClothes = clothes.filter(c => !c.isDraft)

  const handleClothesSelect = (clothesItem: Clothes) => {
    setSelectedClothes(clothesItem)
    setStep('variant')
  }

  const handleVariantToggle = (variant: ClothesVariant, checked: boolean) => {
    if (!selectedClothes) return

    const newSelected = new Map(selectedVariants)

    if (checked) {
      const basePrice = parseFloat(selectedClothes.price)
      const additionalPrice = parseFloat(variant.additional)
      const unitPrice = basePrice + additionalPrice

      newSelected.set(variant.id, {
        clothesId: selectedClothes.id,
        clothesName: selectedClothes.name,
        clothesImage: selectedClothes.clothe_image?.[0]?.url || null,
        variantId: variant.id,
        size: variant.size.size,
        gender: variant.gender.gender,
        basePrice,
        additionalPrice,
        unitPrice
      })
    } else {
      newSelected.delete(variant.id)
    }

    setSelectedVariants(newSelected)
  }

  const handleBack = () => {
    setSelectedClothes(null)
    setStep('clothes')
  }

  const handleConfirm = () => {
    if (selectedVariants.size > 0) {
      onSelect(Array.from(selectedVariants.values()))
    }
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedClothes(null)
    setStep('clothes')
    setSelectedVariants(new Map())
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setOpen(true)
    } else {
      handleClose()
    }
  }

  const currentClothesVariantsCount = selectedClothes
    ? Array.from(selectedVariants.values()).filter(
        v => v.clothesId === selectedClothes.id
      ).length
    : 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' disabled={disabled} className='w-full'>
          <Plus className='mr-2 h-4 w-4' />
          Agregar prendas
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {step === 'clothes'
              ? 'Seleccionar prendas'
              : 'Seleccionar variantes'}
          </DialogTitle>
          <DialogDescription>
            {step === 'clothes'
              ? 'Busca y selecciona prendas del catálogo'
              : `Selecciona las variantes de ${selectedClothes?.name}`}
          </DialogDescription>
        </DialogHeader>

        {step === 'clothes' ? (
          <>
            <Command className='rounded-lg border'>
              <CommandInput placeholder='Buscar prenda...' />
              <CommandList>
                <CommandEmpty>No se encontraron prendas.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className='h-[300px]'>
                    {availableClothes.map(item => {
                      const image = item.clothe_image?.[0]?.url
                      const selectedCount = Array.from(
                        selectedVariants.values()
                      ).filter(v => v.clothesId === item.id).length
                      return (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={() => handleClothesSelect(item)}
                          className='cursor-pointer p-2'
                        >
                          <div className='flex w-full items-center gap-3'>
                            <div className='bg-muted relative h-12 w-12 overflow-hidden rounded'>
                              {image ? (
                                <Image
                                  src={image}
                                  alt={item.name}
                                  fill
                                  className='object-cover'
                                />
                              ) : (
                                <div className='flex h-full w-full items-center justify-center'>
                                  <ImageOff className='text-muted-foreground h-5 w-5' />
                                </div>
                              )}
                            </div>
                            <div className='flex-1'>
                              <p className='font-medium'>{item.name}</p>
                              <p className='text-muted-foreground text-sm'>
                                Precio base: S/{' '}
                                {parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                            <div className='flex items-center gap-2'>
                              {selectedCount > 0 && (
                                <Badge variant='default'>
                                  {selectedCount} seleccionadas
                                </Badge>
                              )}
                              <Badge variant='secondary'>
                                {item.clothes_variant?.length || 0} variantes
                              </Badge>
                            </div>
                          </div>
                        </CommandItem>
                      )
                    })}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
            {selectedVariants.size > 0 && (
              <DialogFooter>
                <div className='flex w-full items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    {selectedVariants.size} variante(s) seleccionada(s)
                  </span>
                  <Button onClick={handleConfirm}>
                    <Check className='mr-2 h-4 w-4' />
                    Agregar seleccionadas
                  </Button>
                </div>
              </DialogFooter>
            )}
          </>
        ) : (
          <div className='space-y-4'>
            <Button variant='ghost' size='sm' onClick={handleBack}>
              ← Volver a prendas
            </Button>

            {selectedClothes && (
              <>
                <div className='bg-muted/50 flex items-center gap-3 rounded-lg p-3'>
                  <div className='bg-muted relative h-16 w-16 overflow-hidden rounded'>
                    {selectedClothes.clothe_image?.[0]?.url ? (
                      <Image
                        src={selectedClothes.clothe_image[0].url}
                        alt={selectedClothes.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <ImageOff className='text-muted-foreground h-6 w-6' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium'>{selectedClothes.name}</p>
                    <p className='text-muted-foreground text-sm'>
                      Precio base: S/{' '}
                      {parseFloat(selectedClothes.price).toFixed(2)}
                    </p>
                  </div>
                  {currentClothesVariantsCount > 0 && (
                    <Badge variant='default'>
                      {currentClothesVariantsCount} seleccionadas
                    </Badge>
                  )}
                </div>

                <ScrollArea className='h-[250px]'>
                  <div className='grid gap-2'>
                    {selectedClothes.clothes_variant?.map(variant => {
                      const additional = parseFloat(variant.additional)
                      const total =
                        parseFloat(selectedClothes.price) + additional
                      const isSelected = selectedVariants.has(variant.id)
                      const isAlreadyAdded = excludeVariantIds.includes(
                        variant.id
                      )
                      return (
                        <label
                          key={variant.id}
                          className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${isAlreadyAdded ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent cursor-pointer'} ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                        >
                          <div className='flex items-center gap-3'>
                            <Checkbox
                              checked={isSelected || isAlreadyAdded}
                              disabled={isAlreadyAdded}
                              onCheckedChange={checked =>
                                handleVariantToggle(variant, checked === true)
                              }
                            />
                            <Badge variant='outline'>{variant.size.size}</Badge>
                            <Badge variant='secondary'>
                              {variant.gender.gender}
                            </Badge>
                            {isAlreadyAdded && (
                              <span className='text-muted-foreground text-xs'>
                                Ya agregada
                              </span>
                            )}
                          </div>
                          <div className='text-right'>
                            {additional > 0 && (
                              <p className='text-muted-foreground text-xs'>
                                +S/ {additional.toFixed(2)}
                              </p>
                            )}
                            <p className='font-medium'>S/ {total.toFixed(2)}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </ScrollArea>

                <DialogFooter>
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      {selectedVariants.size} variante(s) en total
                    </span>
                    <Button
                      onClick={handleConfirm}
                      disabled={selectedVariants.size === 0}
                    >
                      <Check className='mr-2 h-4 w-4' />
                      Agregar seleccionadas
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
