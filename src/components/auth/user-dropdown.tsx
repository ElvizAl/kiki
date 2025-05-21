import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { LogOut, Settings, User } from "lucide-react"
import { getUserSession, logoutUser } from "@/actions/auth-actions"
import { redirect } from "next/navigation"

// Define the logout server action
async function handleLogout() {
    "use server"
    await logoutUser()
    redirect("/login")
}

export default async function UserDropdown() {
    const session = await getUserSession()

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="">
                        <User className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">User menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hello {session?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>{session?.role}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Pengaturan</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <form action={handleLogout} className="w-full">
                            <button className="flex w-full items-center px-2 py-1.5 text-sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Keluar</span>
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}