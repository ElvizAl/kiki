"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import CartDropdown from "@/components/sections/produk/cart-dropdown"

export default function CartButton() {
  const { itemCount } = useCartStore()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleCart = () => setIsCartOpen(!isCartOpen)

  // Close cart dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Only close if clicking outside both the button and the dropdown
        const dropdownElement = document.getElementById("cart-dropdown")
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setIsCartOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleCart}
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
      {isCartOpen && <CartDropdown onClose={() => setIsCartOpen(false)} />}
    </div>
  )
}
