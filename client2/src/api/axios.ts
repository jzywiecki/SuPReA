import axios from 'axios';
import API_URLS from '@/api/urls';
import { ApiRequestError, ConnectionError } from '@/utils/exceptions';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        
        if (error.code === "ERR_NETWORK") {
            throw new ConnectionError(error.message)
        }

        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URLS.BASE_URL}/refresh`, { refresh_token: refreshToken });
                const newAccessToken = response.data.access_token;
                localStorage.setItem('accessToken', newAccessToken);

                axiosInstance.defaults.headers.common['Authorization'] = `${newAccessToken}`;
                originalRequest.headers['Authorization'] = `${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch (error) {
                console.error("Refresh token failed", error);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';

                throw new ApiRequestError("Refresh token failed", 401);
            }
        }
        throw new ApiRequestError(error.response?.data?.message ?? "An error occurred", error.response.status);
    }
);

export default axiosInstance;
