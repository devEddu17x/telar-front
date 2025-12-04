import { Package } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { ClothesVariant } from '../../types'

interface ClothesVariantsTableProps {
  variants: ClothesVariant[]
  basePrice: number
}

const GENDER_COLORS: Record<string, string> = {
  HOMBRE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  MUJER: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  UNISEX: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

export function ClothesVariantsTable({
  variants,
  basePrice
}: ClothesVariantsTableProps) {
  if (variants.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-8'>
        <Package className='text-muted-foreground h-10 w-10' />
        <p className='text-muted-foreground mt-2 text-sm'>
          No hay variantes registradas
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Talla</TableHead>
            <TableHead>Género</TableHead>
            <TableHead className='text-right'>Adicional</TableHead>
            <TableHead className='text-right'>Precio Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map(variant => {
            const additional = parseFloat(variant.additional)
            const total = basePrice + additional

            return (
              <TableRow key={variant.id}>
                <TableCell className='font-medium'>
                  {variant.size.size}
                </TableCell>
                <TableCell>
                  <Badge
                    variant='secondary'
                    className={GENDER_COLORS[variant.gender.gender] || ''}
                  >
                    {variant.gender.gender}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  S/ {additional.toFixed(2)}
                </TableCell>
                <TableCell className='text-right font-medium'>
                  S/ {total.toFixed(2)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
