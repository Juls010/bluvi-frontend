import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
const BACKEND_URL = import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'https://bluvi-backend-production.up.railway.app'
    : 'http://localhost:3000';

export const connectRealtime = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    if (!socket) {
        socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            autoConnect: false,
            auth: { token },
        });
    } else {
        socket.auth = { token };
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectRealtime = () => {
    if (!socket) return;
    socket.removeAllListeners();
    socket.disconnect();
};

export const getRealtimeSocket = () => socket;
