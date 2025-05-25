import Image from "next/image"
import { LogOut, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavbarLink } from "@/components/layout/navbar-links"
import { getUserSession, logoutUser } from "@/actions/auth-actions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { revalidatePath } from "next/cache"
import CartButton from "../sections/produk/cart-button"


export default async function Navbar() {
    const session = await getUserSession()
    async function handleLogout() {
        "use server"
        const keluar = await logoutUser();
        revalidatePath("/login");
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 border-b">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image src="/logo.svg" alt="logo" width={150} height={150} />
                        </Link>
                    </div>
                    <NavbarLink />
                    <div className="flex items-center">
                        <div className="flex-row items-center space-x-4">
                            <div className="flex items-center space-x-4">
                                <CartButton />
                                {session ? (
                                    <div className="flex items-center gap-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="">
                                                    <User className="h-[1.2rem] w-[1.2rem]" />
                                                    <span className="sr-only">User menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Hallo {session.name}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <form action={handleLogout}>
                                                    <Button type="submit" variant="ghost">
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        <span>Keluar</span>
                                                    </Button>
                                                    </form>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href="/login">
                                            <Button variant="outline">Login</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}