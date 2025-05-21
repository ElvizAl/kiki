import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductCard from "@/components/sections/produk/product-card"
import ProductSearch from "@/components/sections/produk/product-search"
import Link from "next/link"

// Expanded product list for the products page with stock information
const allProducts = [
  { name: "Apel Fuji", price: "Rp 35.000/kg", image: "/mangga.jpeg", stock: 25 },
  {
    name: "Mangga Harum Manis",
    price: "Rp 45.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 15,
  },
  {
    name: "Jeruk Mandarin",
    price: "Rp 30.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 30,
  },
  {
    name: "Anggur Merah",
    price: "Rp 75.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 10,
  },
  {
    name: "Pisang Cavendish",
    price: "Rp 25.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 40,
  },
  {
    name: "Nanas Madu",
    price: "Rp 20.000/buah",
    image: "/placeholder.svg?height=300&width=300",
    stock: 20,
  },
  {
    name: "Semangka Merah",
    price: "Rp 15.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 8,
  },
  {
    name: "Kiwi Hijau",
    price: "Rp 90.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 12,
  },
  { name: "Pir Yali", price: "Rp 40.000/kg", image: "/placeholder.svg?height=300&width=300", stock: 18 },
  {
    name: "Strawberry",
    price: "Rp 35.000/pack",
    image: "/placeholder.svg?height=300&width=300",
    stock: 15,
  },
  {
    name: "Alpukat Mentega",
    price: "Rp 45.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 22,
  },
  {
    name: "Melon Jingga",
    price: "Rp 18.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 14,
  },
  {
    name: "Durian Montong",
    price: "Rp 65.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 5,
  },
  {
    name: "Rambutan Binjai",
    price: "Rp 25.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 30,
  },
  {
    name: "Blueberry",
    price: "Rp 50.000/pack",
    image: "/placeholder.svg?height=300&width=300",
    stock: 8,
  },
  {
    name: "Lemon Import",
    price: "Rp 40.000/kg",
    image: "/placeholder.svg?height=300&width=300",
    stock: 20,
  },
]

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-5 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Semua Produk</h1>
          <p className="text-muted-foreground mt-1">Temukan berbagai buah segar berkualitas tinggi</p>
        </div>
        <Link href="/#produk">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <ProductSearch />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {allProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}
