import { io } from 'socket.io-client';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  // path: "http://localhost:3000",
  // extraHeaders: {
  //   Authorization: localStorage.getItem('accessToken'),
  // }
});

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
