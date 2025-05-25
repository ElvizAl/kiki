"use server"

import { prisma } from "@/db/prisma"
import { revalidatePath } from "next/cache"

/**
 * Update stock after order is placed
 */
export async function updateStockAfterOrder(orderItems: { fruitId: string; quantity: number }[]) {
  try {
    // Process each order item
    for (const item of orderItems) {
      // Get current fruit data
      const fruit = await prisma.fruit.findUnique({
        where: { id: item.fruitId },
      })

      if (!fruit) {
        console.error(`Fruit with ID ${item.fruitId} not found`)
        continue
      }

      // Calculate new stock
      const newStock = Math.max(0, fruit.stock - item.quantity)

      // Update fruit stock
      await prisma.fruit.update({
        where: { id: item.fruitId },
        data: { stock: newStock },
      })

      // Record stock history
      await prisma.stockHistory.create({
        data: {
          fruitId: item.fruitId,
          quantity: item.quantity,
          type: "out",
          description: "Pengurangan stok dari pesanan",
        },
      })
    }

    revalidatePath("/dashboard/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error updating stock after order:", error)
    return { success: false, error: "Gagal memperbarui stok" }
  }
}

/**
 * Add stock to inventory
 */
export async function addStock(fruitId: string, quantity: number, description?: string) {
  try {
    // Get current fruit data
    const fruit = await prisma.fruit.findUnique({
      where: { id: fruitId },
    })

    if (!fruit) {
      return { success: false, error: "Buah tidak ditemukan" }
    }

    // Calculate new stock
    const newStock = fruit.stock + quantity

    // Update fruit stock
    await prisma.fruit.update({
      where: { id: fruitId },
      data: { stock: newStock },
    })

    // Record stock history
    await prisma.stockHistory.create({
      data: {
        fruitId,
        quantity,
        type: "in",
        description: description || "Penambahan stok manual",
      },
    })

    revalidatePath("/dashboard/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error adding stock:", error)
    return { success: false, error: "Gagal menambah stok" }
  }
}

/**
 * Get stock history for a fruit
 */
export async function getStockHistory(fruitId: string) {
  try {
    const history = await prisma.stockHistory.findMany({
      where: { fruitId },
      orderBy: { createdAt: "desc" },
      include: {
        fruit: true,
      },
    })
    return { history }
  } catch (error) {
    console.error("Error fetching stock history:", error)
    return { error: "Gagal memuat riwayat stok" }
  }
}
