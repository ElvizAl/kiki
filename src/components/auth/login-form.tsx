"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { loginUser } from "@/actions/auth-actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema } from "@/schemas/auth"

type FormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({})
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setFormState({})

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Validasi dari ddata form
      loginSchema.parse({ email, password })

      // Submit form data
      const result = await loginUser({ email, password })

      if (result.success) {
        if (result.redirectTo) {
          router.push(result.redirectTo)
        } else if (result.role === "ADMIN") {
          router.push("/dashboard")
        } else {
          router.push("/")
        }
      } else {
        setFormState({ errors: { _form: [result.error || "Invalid email or password"] } })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors
        setFormState({ errors })
      } else {
        setFormState({ errors: { _form: ["Something went wrong. Please try again."] } })
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={onSubmit}>
            {formState.errors?._form && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formState.errors._form.join(", ")}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
                {formState.errors?.email && <p className="text-sm text-red-500">{formState.errors.email.join(", ")}</p>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" />
                {formState.errors?.password && <p className="text-sm text-red-500">{formState.errors.password.join(", ")}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}