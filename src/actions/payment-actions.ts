"use server"

import { prisma } from "@/db/prisma"
import { snap } from "@/lib/midtrans"
import type { CartItem } from "@/store/cart-store"
import type { CustomerFormData } from "./customer-actions"
import { createOrUpdateCustomer } from "./customer-actions"
import { updateStockAfterOrder } from "./stock-actions"
import { revalidatePath } from "next/cache"

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
 * Create Midtrans payment token
 */
export async function createPaymentToken(
  customerData: CustomerFormData,
  cartItems: CartItem[],
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
    let subtotal = 0
    const orderItems = cartItems.map((item) => {
      const price = extractPrice(item.price)
      const itemSubtotal = price * item.quantity
      subtotal += itemSubtotal

      return {
        id: item.id,
        price: price,
        quantity: item.quantity,
        name: item.name,
        category: "Buah-buahan",
      }
    })

    const total = subtotal + deliveryCost

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database with PENDING status
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        total: total,
        payment: "TRANSFER", // Will be updated based on actual payment method
        status: "PROCESSING",
        notes: notes,
        orderItems: {
          create: cartItems.map((item) => ({
            fruitId: item.id,
            quantity: item.quantity,
            price: extractPrice(item.price),
            subtotal: extractPrice(item.price) * item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
        customer: true,
      },
    })

    // Add delivery cost as separate item if applicable
    if (deliveryCost > 0) {
      orderItems.push({
        id: "delivery",
        price: deliveryCost,
        quantity: 1,
        name: `Biaya Pengiriman (${deliveryMethod === "express" ? "Express" : "Same Day"})`,
        category: "Pengiriman",
      })
    }

    // Prepare Midtrans transaction details
    const transactionDetails = {
      order_id: orderNumber,
      gross_amount: total,
    }

    // Prepare customer details for Midtrans
    const customerDetails = {
      first_name: customer.name.split(" ")[0],
      last_name: customer.name.split(" ").slice(1).join(" ") || "",
      email: customer.email || "",
      phone: customer.phone || "",
      billing_address: {
        first_name: customer.name.split(" ")[0],
        last_name: customer.name.split(" ").slice(1).join(" ") || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      },
      shipping_address: {
        first_name: customer.name.split(" ")[0],
        last_name: customer.name.split(" ").slice(1).join(" ") || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      },
    }

    // Prepare Midtrans parameter
    const parameter = {
      transaction_details: transactionDetails,
      credit_card: {
        secure: true,
      },
      item_details: orderItems,
      customer_details: customerDetails,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/finish`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
      },
    }

    // Create transaction token
    const transaction = await snap.createTransaction(parameter)

    return {
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: order.id,
      orderNumber: orderNumber,
    }
  } catch (error) {
    console.error("Error creating payment token:", error)
    return { success: false, error: "Gagal membuat token pembayaran" }
  }
}

/**
 * Handle Midtrans payment notification (webhook)
 */
export async function handlePaymentNotification(notificationBody: any) {
  try {
    const statusResponse = await snap.transaction.notification(notificationBody)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`,
    )

    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: { orderItems: true },
    })

    if (!order) {
      console.error(`Order not found: ${orderId}`)
      return { success: false, error: "Order not found" }
    }

    let orderStatus: "PROCESSING" | "COMPLETED" | "CANCELLED" = "PROCESSING"
    let paymentType = "TRANSFER"

    // Determine payment method
    if (statusResponse.payment_type) {
      switch (statusResponse.payment_type) {
        case "credit_card":
          paymentType = "CREDIT_CARD"
          break
        case "bank_transfer":
        case "echannel":
        case "permata":
        case "bca_va":
        case "bni_va":
        case "bri_va":
        case "other_va":
          paymentType = "TRANSFER"
          break
        case "gopay":
        case "shopeepay":
        case "qris":
          paymentType = "DIGITAL_WALLET"
          break
        default:
          paymentType = "TRANSFER"
      }
    }

    // Handle transaction status
    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        // Transaction is challenged by FDS
        orderStatus = "PROCESSING"
      } else if (fraudStatus === "accept") {
        // Transaction is accepted
        orderStatus = "COMPLETED"
        // Update stock after successful payment
        await updateStockAfterOrder(
          order.orderItems.map((item) => ({
            fruitId: item.fruitId,
            quantity: item.quantity,
          })),
        )
      }
    } else if (transactionStatus === "settlement") {
      // Transaction is settled
      orderStatus = "COMPLETED"
      // Update stock after successful payment
      await updateStockAfterOrder(
        order.orderItems.map((item) => ({
          fruitId: item.fruitId,
          quantity: item.quantity,
        })),
      )
    } else if (transactionStatus === "pending") {
      // Transaction is pending
      orderStatus = "PROCESSING"
    } else if (transactionStatus === "deny" || transactionStatus === "cancel" || transactionStatus === "expire") {
      // Transaction is denied, cancelled, or expired
      orderStatus = "CANCELLED"
    }

    // Update order status and payment method
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: orderStatus,
        payment: paymentType as any,
      },
    })

    // Update analytics if payment is successful
    if (orderStatus === "COMPLETED") {
      await updateDailyAnalytics(order.total)
    }

    revalidatePath("/dashboard/orders")

    return { success: true, status: orderStatus }
  } catch (error) {
    console.error("Error handling payment notification:", error)
    return { success: false, error: "Failed to handle payment notification" }
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(orderNumber: string) {
  try {
    const statusResponse = await snap.transaction.status(orderNumber)
    return { success: true, status: statusResponse }
  } catch (error) {
    console.error("Error checking payment status:", error)
    return { success: false, error: "Failed to check payment status" }
  }
}

/**
 * Update daily analytics
 */
async function updateDailyAnalytics(orderTotal: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const analytics = await prisma.analytics.findUnique({
      where: { date: today },
    })

    if (analytics) {
      await prisma.analytics.update({
        where: { id: analytics.id },
        data: {
          totalSales: analytics.totalSales + orderTotal,
          orderCount: analytics.orderCount + 1,
        },
      })
    } else {
      await prisma.analytics.create({
        data: {
          date: today,
          totalSales: orderTotal,
          orderCount: 1,
          customerCount: 1,
        },
      })
    }
  } catch (error) {
    console.error("Error updating analytics:", error)
  }
}
