// src/api/missions.ts
import { Category, Mission } from '../types';
import apiClient from './client';

export const getMissions = async (): Promise<Mission[]> => {
    const response = await apiClient.get<Mission[]>('/missions');
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
export const createMission = async (
    missionData: Omit<Mission, 'id' | 'createdAt'>
): Promise<Mission> => {
    const response = await apiClient.post<Mission>('/missions', {
        ...missionData,
        createdAt: new Date().toISOString(),
    });
    return response.data;
};
