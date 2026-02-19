// src/api/client.ts
import axios from 'axios';

// For physical device: use your machine's local IP (e.g., http://192.168.1.X:3001)
// For Android emulator: use http://10.0.2.2:3001
// For Expo Go on same network: use your machine's IP
const BASE_URL = 'http://192.168.1.162:3001'; // ← C'est l'IP de votre machine

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const apiError = {
                message: error.response?.data?.message ?? error.message ?? 'Une erreur est survenue',
                status: error.response?.status ?? 0,
                code: error.code,
            };
            return Promise.reject(apiError);
        }
        return Promise.reject({ message: 'Erreur inconnue', status: 0 });
    }
);

export default apiClient;
