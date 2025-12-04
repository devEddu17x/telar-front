'use client'

import { useCallback } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Filter, X } from 'lucide-react'

import {
  ORDER_SORT_OPTIONS,
  ORDER_STATUS_OPTIONS,
  SORT_ORDER_OPTIONS
} from '@/modules/orders/constants'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function OrdersFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const status = searchParams.get('status') ?? ''
  const sortBy = searchParams.get('sortBy') ?? ''
  const sortOrder = searchParams.get('sortOrder') ?? ''

  const activeFiltersCount = [status, sortBy, sortOrder].filter(Boolean).length

  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='flex items-center gap-2'>
        <Filter className='text-muted-foreground h-4 w-4' />
        <span className='text-muted-foreground text-sm'>Filtros:</span>
      </div>

      <Select
        value={status || 'all'}
        onValueChange={v => updateSearchParams('status', v)}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Estado' />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUS_OPTIONS.map(s => (
            <SelectItem key={s.value || 'all'} value={s.value || 'all'}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortBy || 'all'}
        onValueChange={v => updateSearchParams('sortBy', v)}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Ordenar por' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Sin ordenar</SelectItem>
          {ORDER_SORT_OPTIONS.map(s => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortOrder || 'all'}
        onValueChange={v => updateSearchParams('sortOrder', v)}
      >
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder='Orden' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Por defecto</SelectItem>
          {SORT_ORDER_OPTIONS.map(s => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFiltersCount > 0 && (
        <Button
          variant='ghost'
          size='sm'
          onClick={clearFilters}
          className='h-9 px-2'
        >
          <X className='mr-1 h-4 w-4' />
          Limpiar
          <Badge variant='secondary' className='ml-1'>
            {activeFiltersCount}
          </Badge>
        </Button>
      )}
    </div>
  )
}
