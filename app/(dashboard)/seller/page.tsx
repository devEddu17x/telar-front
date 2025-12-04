export default function SellerDashboardPage() {
  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>Bienvenido al panel de gestión</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-card rounded-lg border p-6'>
          <h3 className='text-muted-foreground text-sm font-medium'>
            Clientes
          </h3>
          <p className='text-2xl font-bold'>Gestionar</p>
          <p className='text-muted-foreground text-xs'>
            Crear y editar clientes
          </p>
        </div>
        <div className='bg-card rounded-lg border p-6'>
          <h3 className='text-muted-foreground text-sm font-medium'>Prendas</h3>
          <p className='text-2xl font-bold'>Catálogo</p>
          <p className='text-muted-foreground text-xs'>
            Ver y filtrar prendas disponibles
          </p>
        </div>
        <div className='bg-card rounded-lg border p-6'>
          <h3 className='text-muted-foreground text-sm font-medium'>
            Cotizaciones
          </h3>
          <p className='text-2xl font-bold'>Crear</p>
          <p className='text-muted-foreground text-xs'>
            Generar cotizaciones para clientes
          </p>
        </div>
        <div className='bg-card rounded-lg border p-6'>
          <h3 className='text-muted-foreground text-sm font-medium'>Órdenes</h3>
          <p className='text-2xl font-bold'>Producción</p>
          <p className='text-muted-foreground text-xs'>
            Gestionar órdenes de producción
          </p>
        </div>
      </div>
    </div>
  )
}
