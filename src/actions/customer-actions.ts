"use server"
import { z } from "zod"
import { prisma } from "@/db/prisma"
import { CustomerFormData, customerSchema } from "@/schemas/customer"

export async function createOrUpdateCustomer(data: CustomerFormData) {
  try {
    const validatedData = customerSchema.parse(data)

    // Check if customer already exists by email or phone
    let customer = null
    if (validatedData.email) {
      customer = await prisma.customer.findUnique({
        where: { email: validatedData.email },
      })
    }

    if (!customer && validatedData.phone) {
      customer = await prisma.customer.findFirst({
        where: { phone: validatedData.phone },
      })
    }

    // Update existing customer or create new one
    if (customer) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: validatedData,
      })
    } else {
      customer = await prisma.customer.create({
        data: validatedData,
      })
    }

    return { success: true, customer }
  } catch (error) {
    console.error("Error creating/updating customer:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: "Gagal menyimpan data pelanggan" }
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!customer) {
      return { error: "Pelanggan tidak ditemukan" }
    }

    return { customer }
  } catch (error) {
    console.error("Error fetching customer:", error)
    return { error: "Gagal memuat data pelanggan" }
  }
}

/**
 * Get all customers
 */
export async function getAllCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { customers }
  } catch (error) {
    console.error("Error fetching customers:", error)
    return { error: "Gagal memuat data pelanggan" }
  }
}
