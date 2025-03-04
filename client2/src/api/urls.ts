const API_GATEWAY_URL = 'http://localhost:3333';

const API_URLS = {
    BASE_URL: API_GATEWAY_URL,
    API_SERVER_URL: `${API_GATEWAY_URL}/server`,
    REALTIME_SERVER_URL: `${API_GATEWAY_URL}/realtime-server`
} as const;

export default API_URLS;
