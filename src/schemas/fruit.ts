import { coerce, z } from "zod"

export const fruitSchema = z.object({
  name: z.string().min(2),
  price: coerce.number().gt(0),
  stock: coerce.number().gt(0),
})
