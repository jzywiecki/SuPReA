
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:3333';

/** Hardcoded for testing - connects directly to realtime server, bypasses proxy */
const SOCKET_URL = 'http://localhost:3000';
const SOCKET_PATH = '/socket.io';

export const API_URLS = {
    BASE_URL: API_GATEWAY_URL,
    API_SERVER_URL: `${API_GATEWAY_URL}/server`,
    REALTIME_SERVER_URL: `${API_GATEWAY_URL}/realtime-server`,
    SOCKET_URL,
    SOCKET_PATH,
} as const;
