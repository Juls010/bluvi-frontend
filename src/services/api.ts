import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
const API_URL = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true 
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = []; 

const isAuthEndpoint = (url?: string) => {
    if (!url) return false;

    return [
        '/auth/login',
        '/auth/register',
        '/auth/check-email',
        '/auth/verify-email',
        '/auth/refresh',
        '/auth/logout'
    ].some((path) => url.includes(path));
};

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => { 
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status === 401 &&
            !originalRequest?._retry &&
            !isAuthEndpoint(originalRequest?.url)
        ) {
            
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${API_URL}/auth/refresh`, {}, { 
                    withCredentials: true 
                });

                const accessToken = res.data?.accessToken ?? res.data?.token;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    
                    processQueue(null, accessToken);
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
