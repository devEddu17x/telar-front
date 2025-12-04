import { redirect } from 'next/navigation'

import { getRedirectPathByRole, getSession } from '@/modules/auth/lib/dal'
import { SignInForm } from '@/modules/auth/ui/components/sign-in-form'

export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    const redirectPath = getRedirectPathByRole(session.roles)
    redirect(redirectPath)
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-bold'>Iniciar sesión</h1>
          <p className='text-muted-foreground text-sm'>
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  )
}
