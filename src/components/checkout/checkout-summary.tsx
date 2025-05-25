"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/store/cart-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CheckoutSummaryProps {
  items: CartItem[]
  deliveryMethod?: string
}

export default function CheckoutSummary({ items, deliveryMethod = "standard" }: CheckoutSummaryProps) {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const priceMatch = item.price.match(/Rp\s+([\d.,]+)/)
    if (!priceMatch) return total
    const price = Number.parseFloat(priceMatch[1].replace(/\./g, "").replace(",", "."))
    return total + price * item.quantity
  }, 0)

  // Calculate delivery cost
  let deliveryCost = 0
  if (deliveryMethod === "express") {
    deliveryCost = 20000
  } else if (deliveryMethod === "same_day") {
    deliveryCost = 35000
  }

  // Calculate total
  const total = subtotal + deliveryCost

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ringkasan Pesanan</CardTitle>
        <CardDescription>Detail item dalam pesanan Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x {item.price}
                  </p>
                  <p className="text-sm font-medium">
                    {(() => {
                      const priceMatch = item.price.match(/Rp\s+([\d.,]+)/)
                      if (!priceMatch) return item.price
                      const price = Number.parseFloat(priceMatch[1].replace(/\./g, "").replace(",", "."))
                      return `Rp ${formatPrice(price * item.quantity)}`
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{`Rp ${formatPrice(subtotal)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Biaya Pengiriman</span>
            <span>{deliveryCost > 0 ? `Rp ${formatPrice(deliveryCost)}` : "Gratis"}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{`Rp ${formatPrice(total)}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
