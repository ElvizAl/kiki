
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavbarLink } from "@/components/layout/navbar-links"



export default function Navbar() {
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
                                <Button asChild variant="ghost" size="icon" className="w-5 h-5 cursor-pointer">
                                    <ShoppingCart className="w-5 h-5" />
                                </Button>
                                <Button asChild variant="default" className="px-4 py-1 rounded-md">
                                    <Link href="/login">Login</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}