// Tipos para el carrito e-commerce

export interface CartItem {
  id: string // ID único del item en el carrito
  clothesId: string
  clothesName: string
  clothesImage: string
  variantId: string
  size: string
  gender: string
  basePrice: number
  additionalPrice: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export type CartStore = CartState & CartActions
