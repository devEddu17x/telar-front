import { MoreHorizontal, SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { Client } from '../../types'
import { EditClientForm } from './edit-client-form'

interface ClientsTableProps {
  clients: Client[]
  hasFilters?: boolean
}

export function ClientsTable({ clients, hasFilters }: ClientsTableProps) {
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (clients.length === 0) {
    return (
      <div className='text-muted-foreground flex flex-col items-center gap-2 py-8 text-center'>
        {hasFilters ? (
          <>
            <SearchX className='h-8 w-8' />
            <p>No se encontraron clientes con los filtros aplicados</p>
          </>
        ) : (
          <p>No hay clientes registrados</p>
        )}
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead className='w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell className='font-medium'>
                {client.names} {client.lastNames}
              </TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.reference || '—'}</TableCell>
              <TableCell>{formatDate(client.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <EditClientForm client={client} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
