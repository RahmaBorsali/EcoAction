// src/api/missions.ts
import { Category, Mission } from '../types';
import apiClient from './client';

export const getMissions = async (
    category?: Category,
    search?: string
): Promise<Mission[]> => {
    const params: Record<string, string> = {};
    if (category && category !== 'all') {
        params.category = category;
    }
    if (search && search.trim()) {
        params.q = search.trim();
    }
    const response = await apiClient.get<Mission[]>('/missions', { params });
    return response.data;
};

export const getMissionById = async (id: string): Promise<Mission> => {
    const response = await apiClient.get<Mission>(`/missions/${id}`);
    return response.data;
};

export const updateMissionSpots = async (
    missionId: string,
    spotsLeft: number
): Promise<Mission> => {
    const response = await apiClient.patch<Mission>(`/missions/${missionId}`, {
        spotsLeft,
    });
    return response.data;
};
