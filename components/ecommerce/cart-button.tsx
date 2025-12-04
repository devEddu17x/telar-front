'use client'

import { ShoppingCart } from 'lucide-react'

import { useCartItemsCount, useCartStore } from '@/modules/ecommerce/cart/store'

import { Button } from '@/components/ui/button'

export function CartButton() {
  const itemsCount = useCartItemsCount()
  const openCart = useCartStore(state => state.openCart)

  return (
    <Button variant='ghost' size='icon' className='relative' onClick={openCart}>
      <ShoppingCart className='size-5' />
      {itemsCount > 0 && (
        <span className='bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs font-medium'>
          {itemsCount > 99 ? '99+' : itemsCount}
        </span>
      )}
      <span className='sr-only'>Carrito ({itemsCount} items)</span>
    </Button>
  )
}
