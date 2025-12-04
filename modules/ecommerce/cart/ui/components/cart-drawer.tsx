'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Minus, Plus, ShoppingBag, X } from 'lucide-react'

import { GENDER_LABELS } from '@/modules/ecommerce/catalog/constants'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'

import {
  useCartIsOpen,
  useCartItems,
  useCartStore,
  useCartTotal
} from '../../store'
import type { CartItem } from '../../types'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price)
}

export function CartDrawer() {
  const items = useCartItems()
  const isOpen = useCartIsOpen()
  const total = useCartTotal()
  const { closeCart, updateQuantity, removeItem } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && closeCart()}>
      <SheetContent
        side='right'
        className='flex w-full flex-col p-4 sm:max-w-lg'
      >
        <SheetHeader className='border-b pb-4'>
          <SheetTitle className='flex items-center gap-2'>
            <ShoppingBag className='size-5' />
            Mi Carrito ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <ShoppingBag className='text-muted-foreground size-16' />
            <div className='text-center'>
              <p className='font-medium'>Tu carrito está vacío</p>
              <p className='text-muted-foreground text-sm'>
                Agrega productos para comenzar
              </p>
            </div>
            <Button variant='outline' onClick={closeCart}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className='-mx-4 flex-1 px-4'>
              <div className='space-y-4 py-4'>
                {items.map((item: CartItem) => (
                  <div key={item.id} className='flex gap-4'>
                    {/* Imagen */}
                    <div className='relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                      <Image
                        src={item.clothesImage}
                        alt={item.clothesName}
                        fill
                        className='object-cover'
                        sizes='80px'
                      />
                    </div>

                    {/* Info */}
                    <div className='flex flex-1 flex-col'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className='leading-tight font-medium'>
                            {item.clothesName}
                          </h4>
                          <p className='text-muted-foreground text-sm'>
                            {GENDER_LABELS[item.gender] || item.gender} - Talla{' '}
                            {item.size}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:text-destructive -mr-2 size-8'
                          onClick={() => removeItem(item.id)}
                        >
                          <X className='size-4' />
                        </Button>
                      </div>

                      <div className='mt-auto flex items-center justify-between pt-2'>
                        {/* Cantidad */}
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='size-7'
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className='size-3' />
                          </Button>
                          <span className='w-8 text-center text-sm font-medium'>
                            {item.quantity}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='size-7'
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className='size-3' />
                          </Button>
                        </div>

                        {/* Precio */}
                        <p className='font-semibold'>
                          {formatPrice(
                            (item.basePrice + item.additionalPrice) *
                              item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className='border-t pt-4'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='text-xl font-bold'>{formatPrice(total)}</span>
              </div>

              <div className='space-y-2'>
                <Button className='w-full' size='lg' asChild>
                  <Link href='/checkout' onClick={closeCart}>
                    Proceder al pago
                  </Link>
                </Button>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={closeCart}
                >
                  Continuar comprando
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
