'use client'

import { Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useFormContext } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { GENDERS, SIZES } from '../../constants'
import type { CreateClothesInput } from '../../schemas'

interface VariantsFieldArrayProps {
  basePrice?: number
}

export function VariantsFieldArray({ basePrice = 0 }: VariantsFieldArrayProps) {
  const form = useFormContext<CreateClothesInput>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants'
  })

  function handleAddVariant() {
    append({ gender: 'UNISEX', size: '', additional: 0 })
  }

  function getGenderLabel(value: string) {
    return GENDERS.find(g => g.value === value)?.label || value
  }

  function getGenderEmoji(value: string) {
    const emojis: Record<string, string> = {
      HOMBRE: '👨',
      MUJER: '👩',
      UNISEX: '👤'
    }
    return emojis[value] || '👤'
  }

  return (
    <div className='space-y-4'>
      {fields.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-12'>
          <p className='text-muted-foreground mb-4 text-sm'>
            No hay variantes. Agrega al menos una.
          </p>
          <Button type='button' variant='outline' onClick={handleAddVariant}>
            <Plus className='mr-2 h-4 w-4' />
            Agregar variante
          </Button>
        </div>
      ) : (
        <>
          <div className='grid gap-3 sm:grid-cols-2'>
            {fields.map((field, index) => {
              const additional = form.watch(`variants.${index}.additional`) || 0
              const totalPrice = basePrice + additional
              const size = form.watch(`variants.${index}.size`)
              const gender = form.watch(`variants.${index}.gender`)

              return (
                <div
                  key={field.id}
                  className='bg-muted/30 group hover:border-primary/50 relative rounded-lg border p-4 transition-colors'
                >
                  {/* Header con precio total */}
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-lg'>{getGenderEmoji(gender)}</span>
                      <div>
                        <p className='text-sm font-medium'>
                          {size ? `Talla ${size}` : 'Sin talla'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {getGenderLabel(gender)}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <Badge variant='secondary' className='font-mono text-sm'>
                        S/ {totalPrice.toFixed(2)}
                      </Badge>
                      {additional > 0 && (
                        <p className='text-muted-foreground mt-0.5 text-xs'>
                          +S/ {additional.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Campos */}
                  <div className='grid grid-cols-2 gap-3'>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>Talla</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='Seleccionar' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='header-ninos' disabled>
                                — Niños —
                              </SelectItem>
                              {SIZES.filter(s => s.category === 'niños').map(
                                size => (
                                  <SelectItem
                                    key={size.value}
                                    value={size.value}
                                  >
                                    {size.label}
                                  </SelectItem>
                                )
                              )}
                              <SelectItem value='header-adultos' disabled>
                                — Adultos —
                              </SelectItem>
                              {SIZES.filter(s => s.category === 'adultos').map(
                                size => (
                                  <SelectItem
                                    key={size.value}
                                    value={size.value}
                                  >
                                    {size.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.gender`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>Género</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='Seleccionar' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDERS.map(gender => (
                                <SelectItem
                                  key={gender.value}
                                  value={gender.value}
                                >
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='mt-3'>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.additional`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs'>
                            Precio adicional
                          </FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm'>
                                S/
                              </span>
                              <Input
                                type='number'
                                min={0}
                                step={0.01}
                                placeholder='0.00'
                                className='h-9 pl-9'
                                value={field.value || ''}
                                onChange={e => {
                                  const value = e.target.value
                                  field.onChange(
                                    value === '' ? 0 : parseFloat(value)
                                  )
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Botón eliminar */}
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='bg-background absolute -top-2 -right-2 h-7 w-7 rounded-full border opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='text-destructive h-3.5 w-3.5' />
                      <span className='sr-only'>Eliminar variante</span>
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleAddVariant}
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            Agregar otra variante
          </Button>
        </>
      )}

      {form.formState.errors.variants?.root && (
        <p className='text-destructive text-sm'>
          {form.formState.errors.variants.root.message}
        </p>
      )}
      {form.formState.errors.variants?.message && (
        <p className='text-destructive text-sm'>
          {form.formState.errors.variants.message}
        </p>
      )}
    </div>
  )
}
