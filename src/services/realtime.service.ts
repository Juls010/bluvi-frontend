import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectRealtime = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    if (!socket) {
        socket = io('http://localhost:3000', {
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
