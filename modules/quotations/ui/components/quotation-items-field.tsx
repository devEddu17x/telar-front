'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { ChevronDown, ChevronUp, ImageOff, Package, Trash2 } from 'lucide-react'

import { useFieldArray, useFormContext } from 'react-hook-form'

import type { Clothes } from '@/modules/clothes/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { CreateQuotationInput } from '../../schemas'
import {
  ClothesVariantSelector,
  type SelectedVariantInfo
} from './clothes-variant-selector'
import { CustomizationsField } from './customizations-field'

// Quantity input component with local state
function QuantityInput({
  value,
  onChange
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [localValue, setLocalValue] = useState(String(value))

  useEffect(() => {
    setLocalValue(String(value))
  }, [value])

  return (
    <Input
      type='text'
      inputMode='numeric'
      className='text-center'
      value={localValue}
      onChange={e => {
        const raw = e.target.value.replace(/[^0-9]/g, '')
        setLocalValue(raw)
        const num = parseInt(raw)
        if (!isNaN(num) && num >= 1) {
          onChange(num)
        }
      }}
      onBlur={() => {
        const num = parseInt(localValue)
        if (isNaN(num) || num < 1) {
          setLocalValue('1')
          onChange(1)
        }
      }}
    />
  )
}

interface QuotationItemsFieldProps {
  clothes: Clothes[]
}

export function QuotationItemsField({ clothes }: QuotationItemsFieldProps) {
  const form = useFormContext<CreateQuotationInput>()
  const [itemsInfo, setItemsInfo] = useState<Map<number, SelectedVariantInfo>>(
    new Map()
  )
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'details'
  })

  const handleAddItems = (items: SelectedVariantInfo[]) => {
    const startIndex = fields.length
    items.forEach((info, i) => {
      append({
        clothesVariantId: info.variantId,
        quantity: 1,
        customizations: []
      })
      const newIndex = startIndex + i
      setItemsInfo(prev => new Map(prev).set(newIndex, info))
      setExpandedItems(prev => new Set(prev).add(newIndex))
    })
  }

  const handleRemoveItem = (index: number) => {
    remove(index)
    // Update itemsInfo indices
    setItemsInfo(prev => {
      const newMap = new Map<number, SelectedVariantInfo>()
      prev.forEach((value, key) => {
        if (key < index) {
          newMap.set(key, value)
        } else if (key > index) {
          newMap.set(key - 1, value)
        }
      })
      return newMap
    })
    setExpandedItems(prev => {
      const newSet = new Set<number>()
      prev.forEach(key => {
        if (key < index) {
          newSet.add(key)
        } else if (key > index) {
          newSet.add(key - 1)
        }
      })
      return newSet
    })
  }

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Calculate total
  const calculateTotal = () => {
    let total = 0
    fields.forEach((_, index) => {
      const info = itemsInfo.get(index)
      const quantity = form.watch(`details.${index}.quantity`) || 0
      if (info) {
        total += info.unitPrice * quantity
      }
    })
    return total
  }

  const total = calculateTotal()

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Artículos de la cotización
          </CardTitle>
          <Badge variant='secondary'>
            {fields.length} artículo{fields.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {fields.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8'>
            <Package className='text-muted-foreground mb-2 h-10 w-10' />
            <p className='text-muted-foreground mb-4 text-sm'>
              No hay artículos en la cotización
            </p>
            <ClothesVariantSelector
              clothes={clothes}
              onSelect={handleAddItems}
              excludeVariantIds={[]}
            />
          </div>
        ) : (
          <>
            <div className='space-y-3'>
              {fields.map((field, index) => {
                const info = itemsInfo.get(index)
                const quantity = form.watch(`details.${index}.quantity`) || 0
                const subtotal = info ? info.unitPrice * quantity : 0
                const isExpanded = expandedItems.has(index)

                return (
                  <Collapsible
                    key={field.id}
                    open={isExpanded}
                    onOpenChange={() => toggleExpanded(index)}
                  >
                    <div className='rounded-lg border'>
                      <div className='flex items-center gap-3 p-3'>
                        {/* Image */}
                        <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded'>
                          {info?.clothesImage ? (
                            <Image
                              src={info.clothesImage}
                              alt={info.clothesName}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center'>
                              <ImageOff className='text-muted-foreground h-5 w-5' />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-medium'>
                            {info?.clothesName || 'Prenda'}
                          </p>
                          <div className='flex items-center gap-2'>
                            <Badge variant='outline' className='text-xs'>
                              {info?.size || '-'}
                            </Badge>
                            <Badge variant='secondary' className='text-xs'>
                              {info?.gender || '-'}
                            </Badge>
                            <span className='text-muted-foreground text-xs'>
                              S/ {info?.unitPrice.toFixed(2) || '0.00'} c/u
                            </span>
                          </div>
                        </div>

                        {/* Quantity */}
                        <FormField
                          control={form.control}
                          name={`details.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className='w-20'>
                              <FormControl>
                                <QuantityInput
                                  value={field.value || 0}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Subtotal */}
                        <div className='w-24 text-right'>
                          <p className='font-medium'>
                            S/ {subtotal.toFixed(2)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1'>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                            >
                              {isExpanded ? (
                                <ChevronUp className='h-4 w-4' />
                              ) : (
                                <ChevronDown className='h-4 w-4' />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-destructive hover:text-destructive h-8 w-8'
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      <CollapsibleContent>
                        <div className='border-t p-3'>
                          <CustomizationsField
                            detailIndex={index}
                            quantity={quantity}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )
              })}
            </div>

            <ClothesVariantSelector
              clothes={clothes}
              onSelect={handleAddItems}
              excludeVariantIds={fields.map((_, i) =>
                form.getValues(`details.${i}.clothesVariantId`)
              )}
            />

            {/* Summary */}
            <div className='space-y-2 rounded-lg border p-4'>
              <h4 className='font-medium'>Resumen de la cotización</h4>
              <div className='divide-y text-sm'>
                {fields.map((_, index) => {
                  const info = itemsInfo.get(index)
                  const qty = form.watch(`details.${index}.quantity`) || 0
                  const subtotal = info ? info.unitPrice * qty : 0

                  return (
                    <div
                      key={index}
                      className='flex items-center justify-between py-2'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-muted-foreground'>{qty}x</span>
                        <span className='max-w-[200px] truncate'>
                          {info?.clothesName || 'Prenda'}
                        </span>
                        <Badge variant='outline' className='text-xs'>
                          {info?.size || '-'}
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          {info?.gender || '-'}
                        </Badge>
                      </div>
                      <span className='font-medium'>
                        S/ {subtotal.toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className='border-t pt-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Total de artículos:{' '}
                    {fields.reduce(
                      (acc, _, i) =>
                        acc + (form.watch(`details.${i}.quantity`) || 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className='bg-muted/50 flex items-center justify-between rounded-lg p-4'>
              <span className='text-lg font-medium'>Total estimado</span>
              <span className='text-primary text-2xl font-bold'>
                S/ {total.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
