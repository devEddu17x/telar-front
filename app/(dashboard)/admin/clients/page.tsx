import { getClients, searchClients } from '@/modules/clients/queries'
import { ClientsTable } from '@/modules/clients/ui/components/clients-table'
import { CreateClientForm } from '@/modules/clients/ui/components/create-client-form'
import { SearchClientsForm } from '@/modules/clients/ui/components/search-clients-form'

interface ClientsPageProps {
  searchParams: Promise<{
    names?: string
    lastnames?: string
    phone?: string
  }>
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { names, lastnames, phone } = await searchParams
  const hasFilters = !!(names || lastnames || phone)

  const clients = hasFilters
    ? await searchClients({ names, lastnames, phone })
    : await getClients()

  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Clientes</h1>
          <p className='text-muted-foreground'>
            Gestiona los clientes de tu negocio
          </p>
        </div>
        <CreateClientForm />
      </div>
      <SearchClientsForm />
      <ClientsTable clients={clients} hasFilters={hasFilters} />
    </div>
  )
}
