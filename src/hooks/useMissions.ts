// src/hooks/useMissions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissionById, getMissions, createMission } from '@/api/missions';
import { Category, Mission } from '@/types';

export const MISSIONS_QUERY_KEY = 'missions';

export function useMissions(category?: Category, search?: string) {
    return useQuery<Mission[], Error>({
        queryKey: [MISSIONS_QUERY_KEY], // Constant key to fetch only once
        queryFn: getMissions,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        select: (data) => {
            let filtered = data;
            if (category && category !== 'all') {
                filtered = filtered.filter((m) => m.category === category);
            }
            if (search && search.trim()) {
                const q = search.trim().toLowerCase();
                filtered = filtered.filter(
                    (m) =>
                        m.title.toLowerCase().includes(q) ||
                        m.city.toLowerCase().includes(q) ||
                        m.description.toLowerCase().includes(q)
                );
            }
            return filtered;
        },
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
export function useCreateMission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MISSIONS_QUERY_KEY] });
        },
    });
}
