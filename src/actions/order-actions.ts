"use server"

import { prisma } from "@/db/prisma"
import type { CartItem } from "@/store/cart-store"
import type { CustomerFormData } from "@/schemas/customer"
import { createOrUpdateCustomer } from "./customer-actions"
import { updateStockAfterOrder } from "./stock-actions"
import { revalidatePath } from "next/cache"
import type { PaymentType } from "@/generated/prisma"

// Generate a unique order number
function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `ORD-${year}${month}${day}-${random}`
}

// Extract numeric price from string like "Rp 35.000/kg"
function extractPrice(priceString: string): number {
  const priceMatch = priceString.match(/Rp\s+([\d.,]+)/)
  if (!priceMatch) return 0
  return Number.parseFloat(priceMatch[1].replace(/\./g, "").replace(",", "."))
}

/**
 * Create a new order
 */
export async function createOrder(
  customerData: CustomerFormData,
  cartItems: CartItem[],
  paymentMethod: PaymentType,
  deliveryMethod: string,
  notes?: string,
) {
  try {
    // Create or update customer
    const customerResult = await createOrUpdateCustomer(customerData)
    if (!customerResult.success || !customerResult.customer) {
      return { success: false, error: customerResult.error || "Gagal menyimpan data pelanggan" }
    }

    const customer = customerResult.customer

    // Calculate delivery cost
    let deliveryCost = 0
    if (deliveryMethod === "express") {
      deliveryCost = 20000
    } else if (deliveryMethod === "same_day") {
      deliveryCost = 35000
    }

    // Calculate total and prepare order items
    let total = deliveryCost
    const orderItems = cartItems.map((item) => {
      const price = extractPrice(item.price)
      const subtotal = price * item.quantity
      total += subtotal

      return {
        fruitId: item.id,
        quantity: item.quantity,
        price: price,
        subtotal: subtotal,
      }
    })

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        total: total,
        payment: paymentMethod,
        notes: notes,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
        customer: true,
      },
    })

    // Update stock for each item
    await updateStockAfterOrder(orderItems)

    // Update analytics
    await updateDailyAnalytics(order.total)

    // Revalidate paths
    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard/inventory")

    return { success: true, order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Gagal membuat pesanan" }
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            fruit: true,
          },
        },
      },
    })

    if (!order) {
      return { error: "Pesanan tidak ditemukan" }
    }

    return { order }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { error: "Gagal memuat data pesanan" }
  }
}

/**
 * Get all orders
 */
export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return { orders }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { error: "Gagal memuat data pesanan" }
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: string, status: "PROCESSING" | "COMPLETED" | "CANCELLED") {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })
    revalidatePath("/dashboard/orders")
    return { success: true, order }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Gagal memperbarui status pesanan" }
  }
}

/**
 * Update daily analytics
 */
async function updateDailyAnalytics(orderTotal: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    // Find or create today's analytics
    const analytics = await prisma.analytics.findUnique({
      where: { date: today },
    })

    if (analytics) {
      // Update existing analytics
      await prisma.analytics.update({
        where: { id: analytics.id },
        data: {
          totalSales: analytics.totalSales + orderTotal,
          orderCount: analytics.orderCount + 1,
        },
      })
    } else {
      // Create new analytics for today
      await prisma.analytics.create({
        data: {
          date: today,
          totalSales: orderTotal,
          orderCount: 1,
          customerCount: 1, // This is simplified; you might want to count unique customers
        },
      })
    }
  } catch (error) {
    console.error("Error updating analytics:", error)
    // Don't throw error here, just log it
  }
}
