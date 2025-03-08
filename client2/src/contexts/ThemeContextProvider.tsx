import { useEffect, useState } from 'react';
import { ReactNode } from "react";
import { ThemeContext } from "./custom-context-hooks";

export type Theme = 'dark' | 'light' | 'system';

export type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const themeStorageKey = 'vite-ui-theme';

const defaultTheme = 'system';

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
                ? 'dark'
                : 'light';

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(themeStorageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContextProvider;
