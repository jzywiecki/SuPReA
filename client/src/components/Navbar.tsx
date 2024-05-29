import { ModeToggle } from "./ModeToggle";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"    

const Navbar = () => {

    return (
        <nav className="flex items-center justify-between px-6 py-4 h-16">
            <span className="text-xl font-semibold">Visio</span>
            <ul className="flex items-center gap-6 font-medium">
                <li>
                    New project 
                </li>
                <li>
                    Projects 
                </li>
                <li>
                    Collaborators 
                </li>
                <li>
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="" alt="@shadcn" />
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </li>
                <li>
                    <ModeToggle />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;