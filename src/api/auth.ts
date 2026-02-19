// src/api/auth.ts
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';
import apiClient from './client';

export const loginUser = async (
    credentials: LoginCredentials
): Promise<AuthResponse> => {
    // In a real app, this would hit /auth/login
    // With JSON-Server, we query users and simulate auth
    const response = await apiClient.get<User[]>('/users', {
        params: { email: credentials.email },
    });

    const users = response.data;
    if (users.length === 0) {
        return Promise.reject({
            message: 'Email ou mot de passe incorrect',
            status: 401,
        });
    }

    const user = users[0];
    if (user.password !== credentials.password) {
        return Promise.reject({
            message: 'Email ou mot de passe incorrect',
            status: 401,
        });
    }

    return {
        user,
        token: `token_${user.id}_${Date.now()}`,
    };
};

export const registerUser = async (
    credentials: RegisterCredentials
): Promise<AuthResponse> => {
    // Check if email already exists
    const existingResponse = await apiClient.get<User[]>('/users', {
        params: { email: credentials.email },
    });

    if (existingResponse.data.length > 0) {
        return Promise.reject({
            message: 'Cet email est déjà utilisé',
            status: 409,
        });
    }

    const newUser: Omit<User, 'id'> = {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.name)}&background=2D6A4F&color=fff&size=200`,
        bio: 'Nouveau bénévole EcoAction 🌱',
        stats: {
            missionsCompleted: 0,
            upcomingMissions: 0,
            totalHours: 0,
            impact: '0 kg de déchets collectés',
        },
        createdAt: new Date().toISOString(),
    };

    const createResponse = await apiClient.post<User>('/users', newUser);
    const user = createResponse.data;

    return {
        user,
        token: `token_${user.id}_${Date.now()}`,
    };
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
};
