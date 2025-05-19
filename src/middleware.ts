import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decryptData } from "@/lib/encryption"
import type { Session } from "@/lib/auth"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // We need to handle session differently in middleware
  const cookieStore = request.cookies
  const sessionCookie = cookieStore.get("session")

  let session: Session | null = null

  if (sessionCookie) {
    try {
      const decryptedSession = decryptData(sessionCookie.value)
      session = JSON.parse(decryptedSession) as Session
    } catch (error) {
      console.error("Session parsing error:", error)
    }
  }

  const path = request.nextUrl.pathname

  // Protect dashboard route - only admins can access
  if (path === "/dashboard") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
}