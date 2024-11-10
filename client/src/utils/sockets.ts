import { io } from 'socket.io-client';
import { API_URLS } from "@/services/apiUrls";

export const socket = io(API_URLS.BASE_URL, {
    autoConnect: false,
    path: "/realtime-server/socket.io"
});
