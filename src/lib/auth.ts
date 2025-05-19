import type { Role } from "@/generated/prisma"
import { cookies } from "next/headers"
import { decryptData } from "@/lib/encryption"

// Session type
export type Session = {
  id: string
  userId: string
  name: string
  email: string
  role: Role
}

// Get user session
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) {
      return null
    }

    const decryptedSession = decryptData(sessionCookie.value)
    if (!decryptedSession) {
      return null
    }
    try {
      return JSON.parse(decryptedSession) as Session
    } catch (jsonError) {
      console.error("Error parsing session data:", jsonError)
      return null
    }
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}
