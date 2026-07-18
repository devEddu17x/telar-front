import type { OrderStatus } from './types'

// Estados de orden para badges
export const ORDER_STATUSES: Record<
  OrderStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  IN_PRODUCTION: { label: 'En producción', variant: 'default' },
  DONE: { label: 'Completada', variant: 'outline' },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' }
}

// Opciones de estado para filtros (incluye opción "Todos")
export const ORDER_STATUS_OPTIONS: {
  value: OrderStatus | ''
  label: string
}[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'IN_PRODUCTION', label: 'En producción' },
  { value: 'DONE', label: 'Completada' },
  { value: 'CANCELLED', label: 'Cancelada' }
]

// Opciones de ordenamiento
export const ORDER_SORT_OPTIONS = [
  { value: 'createdAt', label: 'Fecha de creación' },
  { value: 'deliveryDate', label: 'Fecha de entrega' },
  { value: 'total', label: 'Total' }
] as const

export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'Descendente' },
  { value: 'asc', label: 'Ascendente' }
] as const

// Departamento fijo
export const FIXED_DEPARTMENT = 'La Libertad'

// Provincias de La Libertad con sus distritos
export const LA_LIBERTAD_LOCATIONS: Record<string, string[]> = {
  Trujillo: [
    'Trujillo',
    'El Porvenir',
    'Florencia de Mora',
    'Huanchaco',
    'La Esperanza',
    'Laredo',
    'Moche',
    'Poroto',
    'Salaverry',
    'Simbal',
    'Víctor Larco Herrera'
  ],
  Ascope: [
    'Ascope',
    'Chicama',
    'Chocope',
    'Magdalena de Cao',
    'Paiján',
    'Rázuri',
    'Santiago de Cao',
    'Casa Grande'
  ],
  Bolívar: [
    'Bolívar',
    'Bambamarca',
    'Condormarca',
    'Longotea',
    'Uchumarca',
    'Ucuncha'
  ],
  Chepén: ['Chepén', 'Pacanga', 'Pueblo Nuevo'],
  'Gran Chimú': ['Cascas', 'Lucma', 'Marmot', 'Sayapullo'],
  Julcán: ['Julcán', 'Calamarca', 'Carabamba', 'Huaso'],
  Otuzco: [
    'Otuzco',
    'Agallpampa',
    'Charat',
    'Huaranchal',
    'La Cuesta',
    'Mache',
    'Paranday',
    'Salpo',
    'Sinsicap',
    'Usquil'
  ],
  Pacasmayo: [
    'San Pedro de Lloc',
    'Guadalupe',
    'Jequetepeque',
    'Pacasmayo',
    'San José'
  ],
  Pataz: [
    'Tayabamba',
    'Buldibuyo',
    'Chillia',
    'Huancaspata',
    'Huaylillas',
    'Huayo',
    'Ongón',
    'Parcoy',
    'Pataz',
    'Pías',
    'Santiago de Challas',
    'Taurija',
    'Urpay'
  ],
  'Sánchez Carrión': [
    'Huamachuco',
    'Chugay',
    'Cochorco',
    'Curgos',
    'Marcabal',
    'Sanagoran',
    'Sarín',
    'Sartimbamba'
  ],
  'Santiago de Chuco': [
    'Santiago de Chuco',
    'Angasmarca',
    'Cachicadán',
    'Mollebamba',
    'Mollepata',
    'Quiruvilca',
    'Santa Cruz de Chuca',
    'Sitabamba'
  ],
  Virú: ['Virú', 'Chao', 'Guadalupito']
}

// Lista de provincias (ciudades) para el select
export const LA_LIBERTAD_CITIES = Object.keys(LA_LIBERTAD_LOCATIONS).sort()

// Función para obtener distritos por ciudad
export function getDistrictsByCity(city: string): string[] {
  return LA_LIBERTAD_LOCATIONS[city] || []
}

// Rango de días para fecha de entrega
