"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  name: z.string().min(3, { message: "Nama harus diisi minimal 3 karakter" }),
  phone: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 digit" }),
  email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal("")),
  address: z.string().min(5, { message: "Alamat harus diisi minimal 5 karakter" }),
  city: z.string().min(3, { message: "Kota harus diisi" }),
  postalCode: z.string().min(5, { message: "Kode pos harus diisi 5 digit" }),
  notes: z.string().optional(),
  deliveryMethod: z.enum(["standard", "express", "same_day"]),
})

type FormValues = z.infer<typeof formSchema>

interface CheckoutFormProps {
  orderInfo: Partial<FormValues>
  onSubmit: (data: FormValues) => void
}

export default function CheckoutForm({ orderInfo, onSubmit }: CheckoutFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: orderInfo.name || "",
      phone: orderInfo.phone || "",
      email: orderInfo.email || "",
      address: orderInfo.address || "",
      city: orderInfo.city || "",
      postalCode: orderInfo.postalCode || "",
      notes: orderInfo.notes || "",
      deliveryMethod: orderInfo.deliveryMethod || "standard",
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Pengiriman</CardTitle>
        <CardDescription>Masukkan informasi pengiriman untuk pesanan Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan kota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan catatan untuk pesanan Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metode Pengiriman</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                    >
                      <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="standard" id="standard" className="sr-only" />
                        <Label htmlFor="standard" className="cursor-pointer flex flex-col h-full">
                          <span className="font-medium">Standar</span>
                          <span className="text-sm text-muted-foreground">2-3 hari kerja</span>
                          <span className="text-sm font-medium text-green-600 mt-2">Gratis</span>
                        </Label>
                      </div>

                      <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="express" id="express" className="sr-only" />
                        <Label htmlFor="express" className="cursor-pointer flex flex-col h-full">
                          <span className="font-medium">Express</span>
                          <span className="text-sm text-muted-foreground">1 hari kerja</span>
                          <span className="text-sm font-medium text-green-600 mt-2">Rp 20.000</span>
                        </Label>
                      </div>

                      <div className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors">
                        <RadioGroupItem value="same_day" id="same_day" className="sr-only" />
                        <Label htmlFor="same_day" className="cursor-pointer flex flex-col h-full">
                          <span className="font-medium">Same Day</span>
                          <span className="text-sm text-muted-foreground">Hari ini (order sebelum 12.00)</span>
                          <span className="text-sm font-medium text-green-600 mt-2">Rp 35.000</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Lanjut ke Pembayaran
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
