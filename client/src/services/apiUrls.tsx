const API_GATEWAY_URL = 'http://localhost:3333';
const NGINX_API_GATEWAY_URL = '/api';
const NGINX = process.env.NGINX === 'TRUE'; 

export const API_URLS = {
    BASE_URL: NGINX ? NGINX_API_GATEWAY_URL : API_GATEWAY_URL,
    API_SERVER_URL: `${NGINX ? NGINX_API_GATEWAY_URL : API_GATEWAY_URL}/server`,
    REALTIME_SERVER_URL: `${NGINX ? NGINX_API_GATEWAY_URL : API_GATEWAY_URL}/realtime-server`
} as const;