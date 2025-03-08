import axiosInstance from "@/api/axios";
import API_URLS from "../urls";
import { ApiRequestError, InvalidCredentialsError } from "@/utils/exceptions";

export async function fetchUserLogin(email: string, password: string) {
    try {
        const request = {
            email: email,
            password: password,
        };

        const response = await axiosInstance.post(`${API_URLS.BASE_URL}/login`, request, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const userData = {
            email: response.data.email,
            username: response.data.username,
            avatarurl: response.data.avatarurl,
            id: response.data.id,
        };

        return {
            userData: userData,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
        }
    } catch (error) {
        if (error instanceof ApiRequestError && error.statusCode === 401) {
            throw new InvalidCredentialsError("Invalid email or password.");
        } 
        throw error;
    }
}
