import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  variantId: string
  handle: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const { items } = get()
        const existingItem = items.find((item) => item.variantId === newItem.variantId)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.variantId === newItem.variantId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        })
      },

      updateQuantity: (variantId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
