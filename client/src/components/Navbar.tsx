import { ModeToggle } from "./ModeToggle";

const Navbar = () => {

    return (
        <nav className="flex items-center justify-between px-6 py-4">
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
                    Account v
                </li>
                <li>
                    <ModeToggle />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;