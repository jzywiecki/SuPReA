import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';
import { makePictureUrl } from '@/utils/url';
import { set } from 'react-hook-form';
import { socket } from '@/utils/sockets';

interface User {
    id: string;
    username: string;
    avatarurl: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    login: (userData: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    isLogged: boolean;
    accessToken: string | null;
    refreshAccessToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState<boolean>(null);

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
        // Store user and tokens in localStorage
        userData.avatarurl = makePictureUrl(userData?.avatarurl);
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setIsLogged(true);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = () => {
        // Clear user data and tokens from state and localStorage
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setIsLogged(false);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        socket.disconnect();
    };

    const refreshAccessToken = async () => {
        try {
            if (!refreshToken) {
                throw new Error("No refresh token available.");
            }

            const response = await axiosInstance.post(`${API_URLS.BASE_URL}/refresh`, {
                refresh_token: refreshToken,
            });

            const newAccessToken = response.data.accessToken;

            // Update access token in state and localStorage
            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
        } catch (error) {
            console.error("Failed to refresh access token", error);
            logout();
        }
    };

    const updateAvatarUrl = (newAvatarUrl) => {
        setUser((prevUser) => ({
            ...prevUser,
            avatarurl: newAvatarUrl,
        }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, accessToken, refreshAccessToken, updateAvatarUrl, isLogged }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
