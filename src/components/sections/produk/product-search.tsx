"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari buah..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm" className="text-xs">
          Harga: Terendah
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Harga: Tertinggi
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Terlaris
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Terbaru
        </Button>
      </div>
    </div>
  )
}
