// src/types/index.ts

export type Category = 'all' | 'beach' | 'forest' | 'waste' | 'education';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    bio: string;
    stats: UserStats;
    createdAt: string;
}

export interface UserStats {
    missionsCompleted: number;
    upcomingMissions: number;
    totalHours: number;
    impact: string;
}

export interface Mission {
    id: string;
    title: string;
    category: Exclude<Category, 'all'>;
    description: string;
    longDescription: string;
    date: string;
    time: string;
    location: string;
    city: string;
    spots: number;
    spotsLeft: number;
    imageUrl: string;
    organizer: string;
    duration: string;
    requirements: string[];
    tags: string[];
    createdAt: string;
}

export interface Participation {
    id: string;
    userId: string;
    missionId: string;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
