"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckoutSuccessProps {
  orderId: string
  email: string
}

export default function CheckoutSuccess({ orderId, email }: CheckoutSuccessProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Pesanan Berhasil!</CardTitle>
        <CardDescription>Terima kasih telah berbelanja di FreshFruit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nomor Pesanan</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p>
            {email ? (
              <>
                Kami telah mengirimkan detail pesanan ke <span className="font-medium">{email}</span>. Anda juga dapat
                melihat status pesanan Anda di halaman akun.
              </>
            ) : (
              <>Detail pesanan Anda telah disimpan. Anda dapat melihat status pesanan Anda di halaman akun.</>
            )}
          </p>
          <p>Pesanan Anda akan diproses dan dikirimkan sesuai dengan metode pengiriman yang Anda pilih.</p>
          <p className="text-muted-foreground text-sm mt-4">
            Jika Anda memiliki pertanyaan tentang pesanan Anda, silakan hubungi layanan pelanggan kami di
            <span className="font-medium"> 0812-3456-7890</span> atau email ke
            <span className="font-medium"> cs@freshfruit.com</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild>
          <Link href="/produk">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Lanjutkan Belanja
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
