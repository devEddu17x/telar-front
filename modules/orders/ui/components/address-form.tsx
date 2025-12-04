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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  FIXED_DEPARTMENT,
  getDistrictsByCity,
  LA_LIBERTAD_CITIES
} from '../../constants'
import type { CreateOrderFormValues } from '../../schemas'

export function AddressForm() {
  const form = useFormContext<CreateOrderFormValues>()
  const selectedCity = form.watch('address.city')
  const districts = selectedCity ? getDistrictsByCity(selectedCity) : []

  // Cuando cambia la ciudad, resetear el distrito
  const handleCityChange = (value: string) => {
    form.setValue('address.city', value)
    form.setValue('address.district', '')
  }

  return (
    <div className='space-y-4'>
      <h4 className='text-sm font-medium'>Dirección de entrega</h4>

      {/* Departamento (fijo) */}
      <FormField
        control={form.control}
        name='address.department'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <FormControl>
              <Input {...field} value={FIXED_DEPARTMENT} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Provincia (ciudad) */}
      <FormField
        control={form.control}
        name='address.city'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia</FormLabel>
            <Select onValueChange={handleCityChange} value={field.value}>
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecciona una provincia' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LA_LIBERTAD_CITIES.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Distrito */}
      <FormField
        control={form.control}
        name='address.district'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Distrito</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedCity}
            >
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={
                      selectedCity
                        ? 'Selecciona un distrito'
                        : 'Primero selecciona una provincia'
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='Ej: Av. España 1234, Urb. Centro'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
