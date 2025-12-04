import Link from 'next/link'

import { ECOMMERCE_ROUTES } from '@/modules/ecommerce/auth/constants'
import { getCustomerSession } from '@/modules/ecommerce/auth/lib/dal'

import { CartButton } from './cart-button'
import { MobileMenu } from './mobile-menu'
import { UserMenu } from './user-menu'

export async function EcommerceNavbar() {
  const session = await getCustomerSession()

  return (
    <header className='bg-background sticky top-0 z-50 border-b'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <MobileMenu session={session} />
          <Link href={ECOMMERCE_ROUTES.CATALOG} className='text-xl font-bold'>
            DUMI
          </Link>
        </div>

        {/* Carrito y Usuario */}
        <div className='flex items-center gap-1'>
          <CartButton />
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  )
}
