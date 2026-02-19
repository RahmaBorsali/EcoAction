// src/hooks/useMissions.ts
import { useQuery } from '@tanstack/react-query';
import { getMissionById, getMissions } from '@/api/missions';
import { Category, Mission } from '@/types';

export const MISSIONS_QUERY_KEY = 'missions';

export function useMissions(category?: Category, search?: string) {
    return useQuery<Mission[], Error>({
        queryKey: [MISSIONS_QUERY_KEY, category, search],
        queryFn: () => getMissions(category, search),
        staleTime: 5 * 60 * 1000,   // 5 minutes
        gcTime: 10 * 60 * 1000,      // 10 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    });
}

export function useMission(id: string) {
    return useQuery<Mission, Error>({
        queryKey: [MISSIONS_QUERY_KEY, id],
        queryFn: () => getMissionById(id),
        staleTime: 3 * 60 * 1000,   // 3 minutes
        gcTime: 10 * 60 * 1000,
        enabled: Boolean(id),
        retry: 1,
    });
}
