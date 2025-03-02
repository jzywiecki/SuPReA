import { useContext } from 'react';
import { createContext } from 'react';
import { UserContextType } from './UserContextProvider';

export const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }

    return userContext;
}
