import { io } from 'socket.io-client';

const URL = 'http://realtime-server:3000';

export const socket = io(URL, {
    autoConnect: false,
});
