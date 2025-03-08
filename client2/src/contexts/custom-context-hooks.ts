import { useContext } from 'react';
import { createContext } from 'react';
import { UserContextType } from './UserContextProvider';
import { ThemeContextType } from './ThemeContextProvider';

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }

    return userContext;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }

    return themeContext;
}
