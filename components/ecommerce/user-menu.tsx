'use client'

import Link from 'next/link'

import { LogOut, ShoppingBag, User } from 'lucide-react'

import { logoutCustomer } from '@/modules/ecommerce/auth/actions/logout-customer'
import { ECOMMERCE_ROUTES } from '@/modules/ecommerce/auth/constants'
import type { CustomerSession } from '@/modules/ecommerce/auth/types'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  session: CustomerSession | null
}

export function UserMenu({ session }: UserMenuProps) {
  if (!session) {
    return (
      <Button variant='outline' size='sm' asChild>
        <Link href={ECOMMERCE_ROUTES.SIGN_IN}>Iniciar sesión</Link>
      </Button>
    )
  }

  const initials = session.userId.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Avatar className='size-8'>
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem asChild>
          <Link href={ECOMMERCE_ROUTES.MY_ORDERS}>
            <ShoppingBag className='mr-2 size-4' />
            Mis pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <User className='mr-2 size-4' />
          Mi cuenta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button onClick={() => logoutCustomer()} className='w-full'>
            <LogOut className='mr-2 size-4' />
            Cerrar sesión
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
