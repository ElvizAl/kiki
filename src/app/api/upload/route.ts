import { NextResponse } from "next/server"
import { del, put } from "@vercel/blob"

export const PUT = async (request: Request) => {
  try {
    const form = await request.formData()
    const file = form.get("file") as File

    if (!file || file.size === 0) {
      return NextResponse.json({ message: "File is Required" }, { status: 400 })
    }

    if (file.size > 4000000) {
      return NextResponse.json({ message: "Ukuran Gambar Terlalu Besar" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File Harus Berupa Gambar" }, { status: 400 })
    }

    // Generate a unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    const blob = await put(uniqueFilename, file, {
      access: "public",
      multipart: true,
      addRandomSuffix: true, // This adds an additional random suffix for extra uniqueness
    })

    return NextResponse.json({ message: "Upload Berhasil", blob })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}

export const DELETE = async (request: Request) => {
  // Fix: Use the request.url instead of a hardcoded string
  const { searchParams } = new URL(request.url);
  const imagesUrl = searchParams.get("imagesUrl") as string;
  await del(imagesUrl);

  return NextResponse.json({ message: "Image deleted successfully", status: 200 });
}