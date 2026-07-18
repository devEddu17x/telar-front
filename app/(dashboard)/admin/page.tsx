import { ClothesCollage } from '@/modules/clothes/ui/components/clothes-collage'

export default function AdminDashboardPage() {
  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Bienvenido al panel de administración
        </p>
      </div>

      <ClothesCollage />
    </div>
  )
}
