import { io } from 'socket.io-client';

const URL = 'http://localhost:3333';

const socketChats = io(URL, {
    autoConnect: false,
    path: "/realtime-server/socket.io/"
});

export { socketChats };