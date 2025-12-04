'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ClothesSearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParamQ = searchParams.get('q') ?? ''
  const [value, setValue] = useState(searchParamQ)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updateSearchParams = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newValue) {
      params.set('q', newValue)
    } else {
      params.delete('q')
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new debounced update
    timeoutRef.current = setTimeout(() => {
      updateSearchParams(newValue)
    }, 300)
  }

  const handleClear = () => {
    setValue('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    updateSearchParams('')
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className='relative w-full max-w-sm'>
      <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
      <Input
        type='text'
        placeholder='Buscar por nombre o descripción...'
        value={value}
        onChange={handleChange}
        className='pr-9 pl-9'
      />
      {value && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2'
          onClick={handleClear}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Limpiar búsqueda</span>
        </Button>
      )}
    </div>
  )
}
