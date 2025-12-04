'use client'

import { useState } from 'react'

import { Check, ChevronsUpDown, User } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { Client } from '@/modules/clients/types'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface ClientSelectorProps {
  clients: Client[]
  value: string
  onChange: (clientId: string) => void
  disabled?: boolean
}

export function ClientSelector({
  clients,
  value,
  onChange,
  disabled = false
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedClient = clients.find(client => client.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className='h-auto min-h-10 w-full justify-between'
        >
          {selectedClient ? (
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 shrink-0' />
              <div className='text-left'>
                <p className='font-medium'>
                  {selectedClient.names} {selectedClient.lastNames}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {selectedClient.phone}
                </p>
              </div>
            </div>
          ) : (
            <span className='text-muted-foreground'>
              Seleccionar cliente...
            </span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder='Buscar cliente...' />
          <CommandList>
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandGroup>
              {clients.map(client => (
                <CommandItem
                  key={client.id}
                  value={`${client.names} ${client.lastNames} ${client.phone}`}
                  onSelect={() => {
                    onChange(client.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === client.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>
                      {client.names} {client.lastNames}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {client.phone}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
