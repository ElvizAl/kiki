"use server"

import { cookies } from "next/headers"
import type { Role } from "@/generated/prisma"
import { prisma } from "@/db/prisma"
import { comparePasswords, hashPassword } from "@/lib/password"
import { encryptData } from "@/lib/encryption"

export async function registerUser({
  name,
  email,
  password,
  role,
}: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    // Mengecek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "User dengan email tersebut sudah ada" }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Buat user baru
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    })

    return { success: true, }
  } catch (error) {
    console.error("Pendaftaran gagal:", error)
    return {
      success: false,
      error: "Gagal mendaftar",
      details: error instanceof Error ? error.message : String(error)
    }
  }
}

// Buat session
export async function createSession(session: {
  id: string
  userId: string
  name: string
  email: string
  role: Role
}): Promise<void> {
  const encryptedSession = encryptData(JSON.stringify(session))
  const cookieStore = await cookies()
  cookieStore.set("session", encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

// Hapus session
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Verify password
    const passwordMatch = await comparePasswords(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    await createSession({
      id: uuidv4(),
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    return {
      success: true,
      role: user.role,
      redirectTo: user.role === "ADMIN" ? "/dashboard" : "/",
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Failed to login" }
  }
}