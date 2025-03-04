import { io } from 'socket.io-client';
import axiosInstance from '@/api/axios';
import API_URLS from '@/api/urls';

export const socket = io(API_URLS.BASE_URL, {
  autoConnect: false,
  path: "/realtime-server/socket.io",
  extraHeaders: {
    Authorization: localStorage.getItem('accessToken') || "",
  }
});

//TODO: check if 'Unauthorized' occurs only for inactive token.
socket.on('connect_error', async (err) => {
  if (err && err.message === 'Unauthorized') {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post(`${API_URLS.BASE_URL}/refresh`, {
        refresh_token: refreshToken,
      });

      const newAccessToken = response.data.access_token;
      localStorage.setItem('accessToken', newAccessToken);

      socket.io.opts.extraHeaders = {
        Authorization: `${newAccessToken}`,
      };
      socket.connect();
    } catch (refreshError) {
      console.error('Token refresh failed', refreshError);

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }
});
