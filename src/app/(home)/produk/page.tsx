
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductCard from "@/components/sections/produk/product-card"
import ProductSearch from "@/components/sections/produk/product-search"
import Link from "next/link"
import { ambilBuah } from "@/actions/fruit-actions"
import { formatPrice } from "@/lib/utils"

export default async function ProductsPage() {
  const { fruits, error } = await ambilBuah()

  // Format the fruits data to match our component's expected format
  const formattedProducts =
    fruits?.map((fruit) => ({
      id: fruit.id,
      name: fruit.name,
      price: `Rp ${formatPrice(fruit.price)}/${fruit.name.toLowerCase().includes("pack") ? "pack" : "kg"}`,
      image: fruit.image || "/placeholder.svg?height=300&width=300",
      stock: fruit.stock,
    })) || []

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

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {formattedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
