import { ModeToggle } from "./ModeToggle";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { useUser } from './UserProvider';
import Image from "./Image";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useUser();
    const location = useLocation();
    if (location.pathname.startsWith('/projects/')) {
        return null; // full screen for proejct editor
    }
    return (

        <nav className="flex items-center justify-between px-6 py-4 h-16 z-50 relative">
            <Link to="/" className="text-3xl font-semibold">Visio</Link>
            <ul className="flex items-center gap-6 font-medium">
                {user ? (
                    <>
                        <li>
                            <Link to="/create-project"
                                className={location.pathname === "/create-project" ? "transition-all duration-100 ease-in pb-[5px] border-b-2 border-gray-600 dark:border-white" : "pb-1"}
                            >New Project</Link>
                        </li>
                        <li>
                            <Link to="/projects"
                                className={location.pathname === "/projects" ? "transition-all duration-100 ease-in pb-[5px] border-b-2 border-gray-600 dark:border-white" : "pb-1"}
                            >Projects</Link>
                        </li>
                        <li>
                            <Link to="/collaborators"
                                className={location.pathname === "/collaborators" ? "transition-all duration-100 ease-in pb-[5px] border-b-2 border-gray-600 dark:border-white" : "pb-1"}
                            >Collaborators</Link>
                        </li>
                    </>
                ) : (
                    <li>
                        {/* Example */}
                    </li>
                )}
                <li>
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            {user?.avatarurl ? (
                                <Image imageURL={user.avatarurl} alt={user.username || "User"} />
                            ) : (
                                <AvatarFallback>?</AvatarFallback>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-5 text-center">
                            {user ? (
                                <>
                                    <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link to={`/profile/${user.id}`} style={{ width: "100%" }}>
                                        <DropdownMenuItem className="text-center w-full flex justify-center items-center">
                                            Profile
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <Link to="/" style={{ width: "100%" }}>
                                        <DropdownMenuItem onClick={logout} className="text-center w-full flex justify-center items-center"
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-center w-full flex justify-center items-center">
                                        <ModeToggle />
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" style={{ width: "100%" }}>
                                        <DropdownMenuItem className="text-center w-full flex justify-center items-center">
                                            Login
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to="/register" style={{ width: "100%" }}>
                                        <DropdownMenuItem className="text-center w-full flex justify-center items-center">
                                            Register
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-center w-full flex justify-center items-center">
                                        <ModeToggle />
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;