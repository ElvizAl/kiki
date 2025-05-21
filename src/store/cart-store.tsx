import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  name: string
  price: string
  image: string
  quantity: number
  stock: number
}

type CartStore = {
  items: CartItem[]
  itemCount: number
  addItem: (product: { name: string; price: string; image: string; stock: number; }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addItem: (product) => {
        const { items } = get()
        const id = product.name.toLowerCase().replace(/\s+/g, "-")
        const existingItemIndex = items.findIndex((item) => item.id === id)

        if (existingItemIndex >= 0) {
          // Don't exceed stock limit
          const newQuantity = items[existingItemIndex].quantity + 1

          set({
            items: items.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: newQuantity } : item,
            ),
            itemCount: get().items.reduce((count, item) => count + item.quantity, 0) + 1,
          })
        } else {
          set({
            items: [...items, { id, ...product, quantity: 1 }],
            itemCount: get().itemCount + 1,
          })
        }
      },

      removeItem: (id) => {
        const { items } = get()
        const itemToRemove = items.find((item) => item.id === id)
        const removedQuantity = itemToRemove ? itemToRemove.quantity : 0

        set({
          items: items.filter((item) => item.id !== id),
          itemCount: get().itemCount - removedQuantity,
        })
      },

      updateQuantity: (id, quantity) => {
        const { items } = get()
        const currentItem = items.find((item) => item.id === id)
        const quantityDiff = currentItem ? quantity - currentItem.quantity : quantity

        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: items.map((item) => (item.id === id ? { ...item, quantity } : item)),
          itemCount: get().itemCount + quantityDiff,
        })
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
        })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
