import CheckoutClient from "@/components/checkout/checkout-client-midtrans"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout - FreshFruit",
  description: "Checkout dan selesaikan pembelian Anda",
}

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">Checkout</h1>
      <CheckoutClient />
    </div>
  )
}
