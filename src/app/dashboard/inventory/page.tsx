"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, MoreHorizontal, Plus, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ambilBuah, hapusBuah } from "@/actions/fruit-actions"

interface Fruit {
  id: string
  name: string
  price: number
  stock: number
  image: string | null
}

export default function InventoryPage() {
  const router = useRouter()
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        setLoading(true)
        const result = await ambilBuah()

        if (result.error) {
          throw new Error(result.error)
        }

        setFruits(result.fruits || [])
      } catch (err) {
        console.error("Error fetching fruits:", err)
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data")
      } finally {
        setLoading(false)
      }
    }

    fetchFruits()
  }, [])

  // Add the missing filteredFruits definition
  const filteredFruits = fruits.filter((fruit) => {
    return fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Add the missing handleDelete function
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      try {
        const result = await hapusBuah(id)

        if (result.success) {
          // Remove the deleted fruit from the state
          setFruits(fruits.filter(fruit => fruit.id !== id))
          alert(`${name} telah dihapus!`)
        } else {
          alert(result.error || "Gagal menghapus buah")
        }
      } catch (error) {
        console.error("Error deleting fruit:", error)
        alert("Terjadi kesalahan saat menghapus buah")
      }
    }
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventaris Buah</h2>
        <Link href="/dashboard/inventory/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Buah
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Buah</CardTitle>
          <CardDescription>Kelola inventaris buah toko Anda di sini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <div className="flex w-full md:w-auto items-center space-x-2">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari buah..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Buah</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center space-x-1">
                      <span>Harga</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center space-x-1">
                      <span>Stok</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-[50px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredFruits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada data buah yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFruits.map((fruit) => (
                    <TableRow key={fruit.id}>
                      <TableCell>
                        <div className="relative h-20 w-20 overflow-hidden rounded-md">
                          <Image
                            src={fruit.image || "/placeholder.svg"}
                            alt={fruit.name}
                            fill
                            sizes="20vw"
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{fruit.name}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        Rp {fruit.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell
                        className={`hidden md:table-cell ${fruit.stock < 10 ? "text-red-500 font-medium" : ""}`}
                      >
                        {fruit.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/inventory/edit/${fruit.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Tambah Stok</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(fruit.id, fruit.name)}
                            >
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
