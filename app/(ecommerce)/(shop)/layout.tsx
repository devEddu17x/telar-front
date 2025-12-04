import { CartDrawer } from '@/modules/ecommerce/cart/ui/components/cart-drawer'

import { EcommerceFooter } from '@/components/ecommerce/footer'
import { EcommerceNavbar } from '@/components/ecommerce/navbar'

interface EcommerceLayoutProps {
  children: React.ReactNode
}

export default function EcommerceLayout({ children }: EcommerceLayoutProps) {
  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <EcommerceNavbar />
      <main className='flex-1'>{children}</main>
      <EcommerceFooter />
      <CartDrawer />
    </div>
  )
}
