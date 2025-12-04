'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, ShoppingBag, ShoppingCart } from 'lucide-react'

import { logoutCustomer } from '@/modules/ecommerce/auth/actions/logout-customer'
import { ECOMMERCE_ROUTES } from '@/modules/ecommerce/auth/constants'
import type { CustomerSession } from '@/modules/ecommerce/auth/types'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface MobileMenuProps {
  session: CustomerSession | null
}

export function MobileMenu({ session }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='size-5' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-72'>
        <SheetHeader>
          <SheetTitle className='text-left'>
            <Link href={ECOMMERCE_ROUTES.CATALOG} className='text-xl font-bold'>
              DUMI
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className='mt-8 flex flex-col gap-4'>
          <Link
            href={ECOMMERCE_ROUTES.CART}
            className={`text-muted-foreground hover:text-foreground flex items-center gap-3 text-lg transition-colors ${
              pathname === ECOMMERCE_ROUTES.CART
                ? 'text-foreground font-medium'
                : ''
            }`}
          >
            <ShoppingCart className='size-5' />
            Carrito
          </Link>

          <div className='my-4 border-t' />

          {session ? (
            <>
              <Link
                href={ECOMMERCE_ROUTES.MY_ORDERS}
                className='text-muted-foreground hover:text-foreground flex items-center gap-3 text-lg transition-colors'
              >
                <ShoppingBag className='size-5' />
                Mis pedidos
              </Link>
              <button
                onClick={() => logoutCustomer()}
                className='text-muted-foreground hover:text-foreground text-left text-lg transition-colors'
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href={ECOMMERCE_ROUTES.SIGN_IN}
                className='text-muted-foreground hover:text-foreground text-lg transition-colors'
              >
                Iniciar sesión
              </Link>
              <Link
                href={ECOMMERCE_ROUTES.SIGN_UP}
                className='text-muted-foreground hover:text-foreground text-lg transition-colors'
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
