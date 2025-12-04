import { Skeleton } from '@/components/ui/skeleton'

export function ClothesDetailSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Columna izquierda - Galería */}
        <div className='space-y-4'>
          <Skeleton className='aspect-square w-full rounded-lg' />
          <div className='flex gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='size-20 shrink-0 rounded-md' />
            ))}
          </div>
        </div>

        {/* Columna derecha - Información */}
        <div className='space-y-6'>
          {/* Título */}
          <Skeleton className='h-10 w-3/4' />

          {/* Descripción */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
          </div>

          <Skeleton className='h-px w-full' />

          {/* Selector de género */}
          <div className='space-y-3'>
            <Skeleton className='h-4 w-16' />
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-24' />
            </div>
          </div>

          {/* Selector de talla */}
          <div className='space-y-3'>
            <Skeleton className='h-4 w-12' />
            <div className='flex flex-wrap gap-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-14' />
              ))}
            </div>
          </div>

          {/* Precio */}
          <Skeleton className='h-8 w-32' />

          <Skeleton className='h-px w-full' />

          {/* Botón */}
          <Skeleton className='h-12 w-full' />

          {/* Volver */}
          <Skeleton className='h-9 w-40' />
        </div>
      </div>
    </div>
  )
}
