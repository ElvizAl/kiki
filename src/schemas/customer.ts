import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(3, { message: "Nama harus diisi minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }).optional().nullable(),
  phone: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 digit" }),
  address: z.string().min(5, { message: "Alamat harus diisi minimal 5 karakter" }),
})

export type CustomerFormData = z.infer<typeof customerSchema>
