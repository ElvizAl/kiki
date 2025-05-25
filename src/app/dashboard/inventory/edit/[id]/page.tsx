"use client"
import { useState, useRef, useTransition, useActionState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CloudUpload, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"
import { editBuah, ambilBuahById } from "@/actions/fruit-actions"

interface EditFruitPageProps {
  params: Promise<{
    id: string
  }>
}

const EditFruitPage = ({ params }: EditFruitPageProps) => {
  const { id } = use(params);
  const router = useRouter()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [fruit, setFruit] = useState<any>({ name: "", price: 0, stock: 0, image: "" })
  const [image, setImage] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [pending, startTransition] = useTransition()

  // Fetch fruit data on component mount
  useEffect(() => {
    const loadFruit = async () => {
      try {
        const result = await ambilBuahById(id)
        if (result.error) {
          toast.error(result.error)
          return
        }

        if (result.fruit) {
          setFruit(result.fruit)
          setImage(result.fruit.image || "")
        }
      } catch (error) {
        console.error("Error loading fruit:", error)
        toast.error("Gagal memuat data buah")
      } finally {
        setLoading(false)
      }
    }

    loadFruit()
  }, [id])

  const handleImageUpload = () => {
    if (!inputFileRef.current?.files) return null
    const file = inputFileRef.current.files[0]

    // Reset message before new upload
    setMessage("")

    const formData = new FormData()
    formData.set("file", file)

    startTransition(async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        })

        const data = await response.json()
        if (response.status !== 200) {
          setMessage(data.message)
          return
        }

        // Access the blob URL correctly from the response
        setImage(data.blob.url)
        toast.success("Upload gambar berhasil")
      } catch (error) {
        console.error(error)
        setMessage("Error uploading image")
        toast.error("Upload gambar gagal")
      }
    })
  }

  const handleRemoveImage = (imageUrl: string) => {
    startTransition(async () => {
      try {
        await fetch(`/api/upload?imagesUrl=${imageUrl}`, {
          method: "DELETE",
        })
        setImage("")
      } catch (error) {
        console.log(error)
      }
    })
  }

  const [state, formAction, isPending] = useActionState(editBuah.bind(null, id, image), null)
  useEffect(() => {
    if (state?.success) {
      toast.success("buah berhasil diupdate")
      router.push("/dashboard/inventory");
    } else if (state?.message && !state?.success) {
      toast.error(state.message)
    }
  }, [state, router, fruit.name])
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <BarLoader />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center">
        <Link href="/dashboard/inventory" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Buah</h2>
      </div>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Detail Buah</CardTitle>
            <CardDescription className="mb-2">
              Perbarui informasi buah dalam inventaris
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Buah</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama buah"
                  defaultValue={fruit.name}
                />
                <div aria-live="polite" aria-atomic="true">
                  <span className="text-sm text-red-500 mt-2">{state?.error?.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="mt-1">
                  Harga (Rp)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  defaultValue={fruit.price}
                />
                <div aria-live="polite" aria-atomic="true">
                  <span className="text-sm text-red-500 mt-2">{state?.error?.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="mt-1">
                  Stok
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  defaultValue={fruit.stock}
                />
                <div aria-live="polite" aria-atomic="true">
                  <span className="text-sm text-red-500 mt-2">{state?.error?.stock}</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="image">Gambar Buah</Label>
                <div className="flex flex-col w-full max-w-[640px] h-[360px] mt-2 mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 relative">
                  {!image ? (
                    <>
                      <Label htmlFor="input-file" className="flex flex-col items-center justify-center w-full h-full">
                        <div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10">
                          <div className="flex flex-col items-center justify-center">
                            {pending ? <BarLoader /> : null}
                            <CloudUpload size={32} className="w-8 h-8 mb-1" />
                            <p className="mb-1 text-sm font-bold">Upload Gambar</p>
                            {message ? (
                              <p className="text-xs text-red-500">{message}</p>
                            ) : (
                              <p className="text-xs">SVG, PNG, JPG, GIF, atau yang lainnya (max:4MB)</p>
                            )}
                          </div>
                        </div>
                        <input
                          id="input-file"
                          ref={inputFileRef}
                          onChange={handleImageUpload}
                          name="input-file"
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </Label>
                    </>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image src={image || "/placeholder.svg"} alt="Preview" fill className="rounded-md object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-3">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/inventory")}>
              Batal
            </Button>
            <div className="flex flex-col space-y-2">
              {state?.message ? (
                <span className="text-sm text-red-500 mt-2">{state.message}</span>
              ) : null}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default EditFruitPage