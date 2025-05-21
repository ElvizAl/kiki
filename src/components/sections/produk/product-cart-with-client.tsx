"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"

interface ProductCardProps {
  product: {
    name: string
    price: string
    image: string
    stock: number
  }
}

export default function ProductCardWithClient({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items } = useCartStore()

  // Calculate current quantity in cart
  const productId = product.name.toLowerCase().replace(/\s+/g, "-")
  const itemInCart = items.find((item) => item.id === productId)
  const quantityInCart = itemInCart?.quantity || 0

  // Check if adding one more would exceed stock
  const isOutOfStock = quantityInCart >= product.stock
  const remainingStock = product.stock - quantityInCart

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error ("Stok tidak cukup")
      return
    }

    setIsAdding(true)

    // Add to cart
    addItem({
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    })

    // Show toast and reset button state
    setTimeout(() => {
      setIsAdding(false)
      toast.success("Ditambahkan ke keranjang")
    }, 600)
  }

  return (
    <div className="bg-background rounded-md overflow-hidden h-[280px] flex flex-col border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-36 w-full">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Stok Terbatas
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-green-600 font-medium text-sm">{product.price}</p>
            <p className="text-xs text-muted-foreground">Stok: {remainingStock}</p>
          </div>
        </div>
        <Button
          className="w-full mt-2"
          size="sm"
          variant={isOutOfStock ? "secondary" : "outline"}
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              <span className="text-xs">Stok Habis</span>
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="text-xs">{isAdding ? "Menambahkan..." : "Tambah"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
