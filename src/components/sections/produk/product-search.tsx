"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

// Type definitions
interface SortOption {
  label: string
  sort: string
}

// Sort options configuration
const SORT_OPTIONS: SortOption[] = [
  { label: "Harga: Terendah", sort: "price_asc" },
  { label: "Harga: Tertinggi", sort: "price_desc" },
  { label: "Terlaris", sort: "popular" },
  { label: "Terbaru", sort: "newest" }
]

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [isClient, setIsClient] = useState(false)
  
  // Safely handle initial search query on client-side
  useEffect(() => {
    // Safely get initial search query from URL
    const initialQuery = searchParams.get("q") || ""
    setSearchQuery(initialQuery)
    setIsClient(true)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams)

    // Set or remove the search query parameter
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    } else {
      params.delete("q")
    }

    // Update the URL with the new search params
    router.push(`/produk?${params.toString()}`)
  }
  
  const handleClearSearch = () => {
    setSearchQuery("")
    router.push("/produk")
  }
  
  const handleQuickSort = (sortType: string) => {
    router.push(`/produk?sort=${sortType}`)
  }
  
  // Prevent rendering until client-side to avoid hydration issues
  if (!isClient) {
    return null
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="bg-muted p-4 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari buah..."
              className="pl-9 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          <Button type="submit" className="md:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" />
            Cari
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((sortOption) => (
            <Button
              key={sortOption.sort}
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleQuickSort(sortOption.sort)}
            >
              {sortOption.label}
            </Button>
          ))}
        </div>
      </form>
    </div>
  )
}