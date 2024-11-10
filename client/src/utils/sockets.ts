import { io } from 'socket.io-client';
import { API_URLS } from "@/services/apiUrls";

export const socket = io(API_URLS.REALTIME_SERVER_URL, {
    autoConnect: false,
});
