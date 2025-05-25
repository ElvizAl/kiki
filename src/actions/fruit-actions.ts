"use server"

import { prisma } from "@/db/prisma"
import { fruitSchema } from "@/schemas/fruit"
import { redirect } from "next/navigation"

export async function hapusBuah(id: string) {
    try {
        await prisma.fruit.delete({
            where: { id }
        })
        return { success: true, message: "Buah berhasil dihapus" }
    } catch (error) {
        console.error("Error deleting fruit:", error)
        return { success: false, error: "Gagal menghapus buah" }
    }
}

export async function ambilBuahById(id: string) {
    try {
        const fruit = await prisma.fruit.findUnique({
            where: {
                id,
            },
        })

        if (!fruit) {
            return { error: "Buah tidak ditemukan" }
        }

        return { fruit }
    } catch (error) {
        console.error("Error fetching fruit:", error)
        return { error: "Gagal memuat data buah" }
    }
}

export async function ambilBuah() {
    try {
        const fruits = await prisma.fruit.findMany({
            orderBy: {
                name: "asc",
            },
        })
        return { fruits }
    } catch (error) {
        console.error("Error fetching fruits:", error)
        return { error: "Gagal memuat data buah" }
    }
}

export const simpanBuah = async (image: string, prevState: unknown, formData: FormData) => {
    if (!image) return { message: "Tolong Tambahkan Gambar Terlebih Dahulu", status: 400 }

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        stock: formData.get("stock"),
    }

    const validatedFields = fruitSchema.safeParse(rawData)
    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, status: 400 }
    }

    const { name, price, stock } = validatedFields.data;

    try {
        await prisma.fruit.create({
            data: {
                name,
                price,
                image,
                stock
            }
        })
    } catch (error) {
        console.log(error)
    }

    redirect("/dashboard/inventory")
} 

export const editBuah = async (id: string, image: string, prevState: unknown, formData: FormData) => {
    if (!image) return { message: "Tolong Tambahkan Gambar Terlebih Dahulu", status: 400 }

    const rawData = {
        name: formData.get("name"),
        price: formData.get("price"),
        stock: formData.get("stock"),
    }

    const validatedFields = fruitSchema.safeParse(rawData)
    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors, status: 400 }
    }

    const { name, price, stock } = validatedFields.data;

    try {
        await prisma.$transaction([
            prisma.fruit.update({
                where: { id: id },
                data: {
                    name,
                    price,
                    image,
                    stock
                }
            })
        ])
        
        // Return success response instead of redirecting
        return { 
            success: true, 
            message: "Buah berhasil diperbarui", 
            status: 200 
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Gagal memperbarui data buah",
            status: 500
        }
    }
}