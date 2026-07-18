'use client'

import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { CreateOrderFormValues } from '../../schemas'

export function AddressForm() {
  const form = useFormContext<CreateOrderFormValues>()

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-medium'>Dirección de entrega</h4>

      <div className='grid grid-cols-2 gap-4'>
        {/* Departamento */}
        <FormField
          control={form.control}
          name='address.department'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input placeholder='Ej: La Libertad' maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provincia / Ciudad */}
        <FormField
          control={form.control}
          name='address.city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia/Ciudad</FormLabel>
              <FormControl>
                <Input placeholder='Ej: Trujillo' maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Distrito */}
      <FormField
        control={form.control}
        name='address.district'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Distrito</FormLabel>
            <FormControl>
              <Input placeholder='Ej: Moche' maxLength={100} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Calle / Dirección */}
      <FormField
        control={form.control}
        name='address.street'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección exacta</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='Ej: Av. Heroica 123'
                maxLength={255}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
