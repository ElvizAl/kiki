"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart-store"
import CheckoutSummary from "@/components/checkout/checkout-summary"
import CheckoutForm from "@/components/checkout/checkout-form"
import CheckoutPayment from "@/components/checkout/checkout-payment-midtrans"
import CheckoutSuccess from "@/components/checkout/checkout-succes"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Steps, Step } from "@/components/ui/steps"
import { createOrder } from "@/actions/order-actions"
import type { PaymentType } from "@/generated/prisma"
import { toast } from "sonner"

type CheckoutStep = "information" | "payment" | "confirmation"

export default function CheckoutClient() {
  const router = useRouter()
  const { items, itemCount, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information")
  
  // Tentukan deliveryMethod sebagai salah satu dari nilai yang diizinkan
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    deliveryMethod: "standard" as "standard" | "express" | "same_day", // Tipe yang benar
    paymentMethod: "CASH" as PaymentType,
  })
  
  const [orderId, setOrderId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Jika keranjang kosong, arahkan ke halaman produk
  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Keranjang Belanja Kosong</h2>
        <p className="text-muted-foreground mb-6">Anda belum menambahkan produk apapun ke keranjang belanja.</p>
        <Button onClick={() => router.push("/produk")}>Belanja Sekarang</Button>
      </div>
    )
  }

  const handleInfoSubmit = (data: Partial<typeof orderInfo>) => {
    setOrderInfo({ ...orderInfo, ...data })
    setCurrentStep("payment")
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = async (paymentMethod: PaymentType) => {
    setIsProcessing(true)
    setOrderInfo({ ...orderInfo, paymentMethod })

    try {
      // Membuat objek data customer
      const customerData = {
        name: orderInfo.name,
        email: orderInfo.email,
        phone: orderInfo.phone,
        address: `${orderInfo.address}, ${orderInfo.city}, ${orderInfo.postalCode}`,
      }

      // Membuat pesanan di database
      const result = await createOrder(customerData, items, paymentMethod, orderInfo.deliveryMethod, orderInfo.notes)

      if (result.success && result.order) {
        // Menyimpan ID pesanan untuk halaman konfirmasi
        setOrderId(result.order.orderNumber)

        // Mengosongkan keranjang setelah pesanan berhasil
        clearCart()

        // Pindah ke langkah konfirmasi
        setCurrentStep("confirmation")
        window.scrollTo(0, 0)
      } else {
        toast.error("gagal membuat pesanan")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Gagal membuat pesanan")
    } finally {
      setIsProcessing(false)
    }
  }

  const goBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("information")
    } else if (currentStep === "information") {
      router.push("/produk")
    }
  }

  return (
    <div>
      {currentStep !== "confirmation" && (
        <Button variant="ghost" onClick={goBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      )}

      {currentStep !== "confirmation" && (
        <div className="mb-8">
          <Steps currentStep={currentStep === "information" ? 0 : 1} totalSteps={2}>
            <Step id="information" title="Informasi Pengiriman" />
            <Step id="payment" title="Pembayaran" />
          </Steps>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {currentStep === "information" && (
          <>
            <div className="lg:col-span-2">
              <CheckoutForm orderInfo={orderInfo} onSubmit={handleInfoSubmit} />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary items={items} />
            </div>
          </>
        )}

        {currentStep === "payment" && (
          <>
            <div className="lg:col-span-2">
              <CheckoutPayment onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary items={items} deliveryMethod={orderInfo.deliveryMethod} />
            </div>
          </>
        )}

        {currentStep === "confirmation" && (
          <div className="lg:col-span-3">
            <CheckoutSuccess orderId={orderId} email={orderInfo.email} />
          </div>
        )}
      </div>
    </div>
  )
}
