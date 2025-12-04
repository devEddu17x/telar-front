import Link from 'next/link'

import { ECOMMERCE_ROUTES } from '@/modules/ecommerce/auth/constants'

export function EcommerceFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='border-t'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <Link href={ECOMMERCE_ROUTES.CATALOG} className='font-bold'>
            DUMI
          </Link>
          <p className='text-muted-foreground text-sm'>
            © {currentYear} DUMI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
