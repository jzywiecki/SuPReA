import React from 'react';
import { ModeToggle } from './ModeToggle';

const Menu = () => {
    return (
        <div>
            <Navbar />
        </div>
    );    
}

const Navbar = () => {

    return (
        <nav class="flex items-center justify-between px-6 py-4">
            <span class="text-2xl font-semibold">Visio</span>
            <ul class="flex items-center gap-6 font-medium">
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
                    <ModeToggle />
                </li>
            </ul>
        </nav>
    );
};

export default Menu;