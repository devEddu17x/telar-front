'use client'

import { useActionState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { registerCustomer } from '../../actions/register-customer'
import { ECOMMERCE_ROUTES } from '../../constants'
import {
  customerRegisterDefaultValues,
  customerRegisterSchema,
  type CustomerRegisterInput
} from '../../schemas'
import type { ActionResponse } from '../../types'

const initialState: ActionResponse<{ redirectTo: string }> = {
  success: false
}

export function CustomerSignUpForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    registerCustomer,
    initialState
  )

  const form = useForm<CustomerRegisterInput>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: customerRegisterDefaultValues
  })

  useEffect(() => {
    if (state.success && state.data?.redirectTo) {
      router.push(state.data.redirectTo)
    }
  }, [state, router])

  return (
    <Form {...form}>
      <form action={formAction} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='names'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Juan Carlos'
                    autoComplete='given-name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastNames'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='García López'
                    autoComplete='family-name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='correo@ejemplo.com'
                  autoComplete='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='••••••••'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='••••••••'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state.error && (
          <div className='bg-destructive/10 text-destructive rounded-md p-3 text-sm'>
            {state.error}
          </div>
        )}

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className='text-muted-foreground text-center text-sm'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            href={ECOMMERCE_ROUTES.SIGN_IN}
            className='text-primary hover:underline'
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </Form>
  )
}
