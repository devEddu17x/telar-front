'use client'

import { Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useFormContext } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { CreateQuotationInput } from '../../schemas'

interface CustomizationsFieldProps {
  detailIndex: number
  quantity: number
}

export function CustomizationsField({
  detailIndex,
  quantity
}: CustomizationsFieldProps) {
  const form = useFormContext<CreateQuotationInput>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `details.${detailIndex}.customizations`
  })

  const handleAddCustomization = () => {
    append({})
  }

  const maxCustomizations = Math.min(quantity, 100)

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>
          Personalizaciones (opcional)
        </span>
        <Badge variant='secondary'>
          {fields.length} de {maxCustomizations}
        </Badge>
      </div>

      {fields.length > 0 && (
        <div className='grid gap-2'>
          {fields.map((field, index) => (
            <div key={field.id} className='space-y-2 rounded-lg border p-3'>
              <div className='flex items-center justify-between'>
                <div className='text-muted-foreground text-xs font-medium'>
                  Personalización {index + 1}
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => remove(index)}
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name={`details.${detailIndex}.customizations.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Nombre'
                          maxLength={100}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`details.${detailIndex}.customizations.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Número'
                          min={0}
                          max={100}
                          step={1}
                          {...field}
                          value={field.value ?? ''}
                          onFocus={() => {
                            if (field.value === 0) field.onChange(undefined)
                          }}
                          onChange={e => {
                            const val = e.target.value
                            field.onChange(
                              val === '' ? undefined : parseFloat(val)
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`details.${detailIndex}.customizations.${index}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Notas (opcional)'
                        maxLength={1024}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      )}

      {fields.length < maxCustomizations && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='w-full'
          onClick={handleAddCustomization}
        >
          <Plus className='mr-2 h-4 w-4' />
          Agregar personalización
        </Button>
      )}
    </div>
  )
}
