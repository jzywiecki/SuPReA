import { ModeToggle } from "./ModeToggle";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useUser } from './UserProvider';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom";
import Profile from "@/pages/Profile";

const Navbar = () => {
    const { user, logout } = useUser();

    return (
        <nav className="flex items-center justify-between px-6 py-4 h-16 z-50 relative">
            <Link to="/" className="text-xl font-semibold">Visio</Link>
            <ul className="flex items-center gap-6 font-medium">
                {user ? (
                    <>
                <li>
                    <Link to="/create-project">New Project</Link>
                </li>
                <li>
                    <Link to="/projects">Projects</Link>
                </li>
                <li>
                    <Link to="/collaborators">Collaborators</Link>
                </li>
                </>
                ) : (
                    <li>
                        Example
                    </li>
                )}
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        {user ? (
                                <>
                                    <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to={`/profile/${user.id}`}>Profile</Link> 
                                        </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout}>
                                        <Link to="/">Logout</Link>
                                        </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem>
                                        <Link to="/login">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/register">Register</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
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