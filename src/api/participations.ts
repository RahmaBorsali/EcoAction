// src/api/participations.ts
import { Participation } from '../types';
import apiClient from './client';

export const getParticipationsByUser = async (
    userId: string
): Promise<Participation[]> => {
    const response = await apiClient.get<Participation[]>('/participations', {
        params: { userId, status: 'confirmed' },
    });
    return response.data;
};

export const getParticipationsByMission = async (
    missionId: string
): Promise<Participation[]> => {
    const response = await apiClient.get<Participation[]>('/participations', {
        params: { missionId, status: 'confirmed' },
    });
    return response.data;
};

export const createParticipation = async (
    userId: string,
    missionId: string
): Promise<Participation> => {
    const newParticipation: Omit<Participation, 'id'> = {
        userId,
        missionId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
    };
    const response = await apiClient.post<Participation>(
        '/participations',
        newParticipation
    );
    return response.data;
};

export const cancelParticipation = async (
    participationId: string
): Promise<Participation> => {
    const response = await apiClient.patch<Participation>(
        `/participations/${participationId}`,
        { status: 'cancelled' }
    );
    return response.data;
};
