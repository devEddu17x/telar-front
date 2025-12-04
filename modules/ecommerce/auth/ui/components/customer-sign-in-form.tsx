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

import { loginCustomer } from '../../actions/login-customer'
import { ECOMMERCE_ROUTES } from '../../constants'
import {
  customerLoginDefaultValues,
  customerLoginSchema,
  type CustomerLoginInput
} from '../../schemas'
import type { ActionResponse } from '../../types'

const initialState: ActionResponse<{ redirectTo: string }> = {
  success: false
}

export function CustomerSignInForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    loginCustomer,
    initialState
  )

  const form = useForm<CustomerLoginInput>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: customerLoginDefaultValues
  })

  useEffect(() => {
    if (state.success && state.data?.redirectTo) {
      router.push(state.data.redirectTo)
    }
  }, [state, router])

  return (
    <Form {...form}>
      <form action={formAction} className='space-y-4'>
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
                  autoComplete='current-password'
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
          {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <p className='text-muted-foreground text-center text-sm'>
          ¿No tienes una cuenta?{' '}
          <Link
            href={ECOMMERCE_ROUTES.SIGN_UP}
            className='text-primary hover:underline'
          >
            Regístrate
          </Link>
        </p>
      </form>
    </Form>
  )
}
