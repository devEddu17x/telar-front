import { Skeleton } from '@/components/ui/skeleton'

export function CatalogSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className='flex flex-col'>
          <Skeleton className='aspect-square w-full rounded-lg' />
          <div className='mt-4 space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <div className='flex items-center justify-between pt-1'>
              <Skeleton className='h-6 w-20' />
              <Skeleton className='h-8 w-24' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
