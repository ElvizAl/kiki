"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"

interface CartDropdownProps {
  onClose: () => void
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const { items, removeItem, updateQuantity, itemCount } = useCartStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calculate total price
  const totalPrice = items.reduce((total, item) => {
    // Extract numeric price from string like "Rp 35.000/kg"
    const priceMatch = item.price.match(/Rp\s+([\d.,]+)/)
    if (!priceMatch) return total

    // Convert price string to number (remove dots and replace comma with dot)
    const price = Number.parseFloat(priceMatch[1].replace(/\./g, "").replace(",", "."))
    return total + price * item.quantity
  }, 0)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      id="cart-dropdown"
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-background rounded-md shadow-lg border overflow-hidden z-50"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Keranjang Belanja</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Keranjang belanja Anda kosong</p>
          <Button asChild className="mt-4" onClick={onClose}>
            <Link href="/produk">Belanja Sekarang</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="p-3 border-b flex items-center gap-3">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-green-600 text-sm">{item.price}</p>
                  <div className="flex items-center mt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/50">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Total ({itemCount} item)</span>
              <span className="font-medium">{`Rp ${formatPrice(totalPrice)}`}</span>
            </div>
            <Button asChild className="w-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
