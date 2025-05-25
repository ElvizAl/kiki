"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Landmark, Wallet } from "lucide-react"
import type { PaymentType } from "@/generated/prisma"

interface CheckoutPaymentProps {
  onSubmit: (paymentMethod: PaymentType) => void
  isProcessing: boolean
}

export default function CheckoutPayment({ onSubmit, isProcessing }: CheckoutPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("CASH")

  const handleSubmit = () => {
    onSubmit(paymentMethod)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metode Pembayaran</CardTitle>
        <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentType)}
          className="grid gap-4"
        >
          <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="CASH" id="cash" className="sr-only" />
            <Label htmlFor="cash" className="cursor-pointer flex items-center gap-3">
              <Landmark className="h-5 w-5" />
              <div className="flex-grow">
                <div className="font-medium">Tunai</div>
                <div className="text-sm text-muted-foreground">Bayar saat pengiriman</div>
              </div>
            </Label>
          </div>

          <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="TRANSFER" id="transfer" className="sr-only" />
            <Label htmlFor="transfer" className="cursor-pointer flex items-center gap-3">
              <Landmark className="h-5 w-5" />
              <div className="flex-grow">
                <div className="font-medium">Transfer Bank</div>
                <div className="text-sm text-muted-foreground">BCA, Mandiri, BNI, BRI</div>
              </div>
            </Label>
          </div>

          <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="DIGITAL_WALLET" id="ewallet" className="sr-only" />
            <Label htmlFor="ewallet" className="cursor-pointer flex items-center gap-3">
              <Wallet className="h-5 w-5" />
              <div className="flex-grow">
                <div className="font-medium">E-Wallet</div>
                <div className="text-sm text-muted-foreground">GoPay, OVO, DANA, LinkAja</div>
              </div>
            </Label>
          </div>

          <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
            <RadioGroupItem value="CREDIT_CARD" id="credit_card" className="sr-only" />
            <Label htmlFor="credit_card" className="cursor-pointer flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              <div className="flex-grow">
                <div className="font-medium">Kartu Kredit</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, JCB</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-8 p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Informasi Pembayaran</h3>
          {paymentMethod === "CASH" && (
            <div className="space-y-2 text-sm">
              <p>Anda akan membayar saat pesanan diterima.</p>
              <p className="text-muted-foreground mt-2">
                Pastikan Anda menyiapkan uang pas untuk memudahkan proses pembayaran.
              </p>
            </div>
          )}

          {paymentMethod === "TRANSFER" && (
            <div className="space-y-2 text-sm">
              <p>Silakan transfer ke rekening berikut:</p>
              <p className="font-medium">Bank BCA</p>
              <p>Nomor Rekening: 1234567890</p>
              <p>Atas Nama: PT Fresh Fruit Indonesia</p>
              <p className="text-muted-foreground mt-2">
                Pembayaran akan diverifikasi dalam 10-30 menit setelah transfer.
              </p>
            </div>
          )}

          {paymentMethod === "DIGITAL_WALLET" && (
            <div className="space-y-2 text-sm">
              <p>Anda akan diarahkan ke aplikasi e-wallet pilihan Anda untuk menyelesaikan pembayaran.</p>
              <p className="text-muted-foreground mt-2">
                Pastikan aplikasi e-wallet Anda sudah terinstall dan memiliki saldo yang cukup.
              </p>
            </div>
          )}

          {paymentMethod === "CREDIT_CARD" && (
            <div className="space-y-2 text-sm">
              <p>Anda akan diarahkan ke halaman pembayaran yang aman untuk memasukkan detail kartu kredit Anda.</p>
              <p className="text-muted-foreground mt-2">
                Semua transaksi kartu kredit diproses dengan enkripsi SSL dan memenuhi standar PCI DSS.
              </p>
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6" disabled={isProcessing}>
          {isProcessing ? "Memproses Pembayaran..." : "Selesaikan Pesanan"}
        </Button>
      </CardContent>
    </Card>
  )
}
