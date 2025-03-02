import { useState } from "react";
import { ReactNode } from "react";
import { useEffect } from "react";
import { UserContext } from "./custom-context-hooks";

export type User = {
    id: string;
    username: string;
    avatarurl: string;
    email: string;
}

export type UserContextType = {
    isLogged: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    login: (userData: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    refreshAccessToken: (newAccessToken: string) => void;
}

const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
    
        if (storedUser && storedAccessToken && storedRefreshToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, []);

    const login = (userData: User, accessToken: string, refreshToken: string) => {
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setIsLogged(true);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsLogged(false);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const refreshAccessToken = async (newAccessToken: string) => {
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
    };

    return (
        <UserContext.Provider value={{ isLogged, accessToken, refreshToken, user, login, logout, refreshAccessToken }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;
