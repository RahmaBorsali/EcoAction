// src/hooks/useParticipations.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    cancelParticipation,
    createParticipation,
    getParticipationsByUser,
} from '@/api/participations';
import { updateMissionSpots } from '@/api/missions';
import { Mission, Participation } from '@/types';
import { MISSIONS_QUERY_KEY } from './useMissions';

export const PARTICIPATIONS_QUERY_KEY = 'participations';

export function useUserParticipations(userId: string) {
    return useQuery<Participation[], Error>({
        queryKey: [PARTICIPATIONS_QUERY_KEY, userId],
        queryFn: () => getParticipationsByUser(userId),
        staleTime: 2 * 60 * 1000,  // 2 minutes
        gcTime: 5 * 60 * 1000,
        enabled: Boolean(userId),
    });
}

export function useEnrollMission(userId: string) {
    const queryClient = useQueryClient();

    return useMutation<
        Participation,
        Error,
        { missionId: string },
        { previousMissions: Mission[] | undefined; previousParticipations: Participation[] | undefined }
    >({
        mutationFn: ({ missionId }) => createParticipation(userId, missionId),

        // ── Optimistic UI ──────────────────────────────────────────────────
        onMutate: async ({ missionId }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: [MISSIONS_QUERY_KEY] });
            await queryClient.cancelQueries({ queryKey: [PARTICIPATIONS_QUERY_KEY, userId] });

            // Snapshot the previous values
            const previousMissions = queryClient.getQueryData<Mission[]>([MISSIONS_QUERY_KEY]);
            const previousParticipations = queryClient.getQueryData<Participation[]>([
                PARTICIPATIONS_QUERY_KEY,
                userId,
            ]);

            // Optimistically update missions (decrement spotsLeft)
            queryClient.setQueryData<Mission[]>([MISSIONS_QUERY_KEY], (old) =>
                old?.map((m) =>
                    m.id === missionId
                        ? { ...m, spotsLeft: Math.max(0, m.spotsLeft - 1) }
                        : m
                )
            );

            // Optimistically add a participation
            const optimisticParticipation: Participation = {
                id: `optimistic_${Date.now()}`,
                userId,
                missionId,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData<Participation[]>(
                [PARTICIPATIONS_QUERY_KEY, userId],
                (old) => [...(old ?? []), optimisticParticipation]
            );

            return { previousMissions, previousParticipations };
        },

        // ── Rollback on error ──────────────────────────────────────────────
        onError: (_error, _variables, context) => {
            if (context?.previousMissions !== undefined) {
                queryClient.setQueryData([MISSIONS_QUERY_KEY], context.previousMissions);
            }
            if (context?.previousParticipations !== undefined) {
                queryClient.setQueryData(
                    [PARTICIPATIONS_QUERY_KEY, userId],
                    context.previousParticipations
                );
            }
        },

        // ── Sync with server after success ─────────────────────────────────
        onSuccess: async (_data, { missionId }) => {
            // Update server with actual spot count
            const missions = queryClient.getQueryData<Mission[]>([MISSIONS_QUERY_KEY]);
            const mission = missions?.find((m) => m.id === missionId);
            if (mission) {
                await updateMissionSpots(missionId, Math.max(0, mission.spotsLeft));
            }
            await queryClient.invalidateQueries({ queryKey: [MISSIONS_QUERY_KEY] });
            await queryClient.invalidateQueries({ queryKey: [PARTICIPATIONS_QUERY_KEY, userId] });
        },
    });
}

export function useCancelMission(userId: string) {
    const queryClient = useQueryClient();

    return useMutation<
        Participation,
        Error,
        { participationId: string; missionId: string },
        { previousParticipations: Participation[] | undefined; previousMissions: Mission[] | undefined }
    >({
        mutationFn: ({ participationId }) => cancelParticipation(participationId),

        // ── Optimistic UI ──────────────────────────────────────────────────
        onMutate: async ({ missionId }) => {
            await queryClient.cancelQueries({ queryKey: [PARTICIPATIONS_QUERY_KEY, userId] });
            await queryClient.cancelQueries({ queryKey: [MISSIONS_QUERY_KEY] });

            const previousParticipations = queryClient.getQueryData<Participation[]>([
                PARTICIPATIONS_QUERY_KEY,
                userId,
            ]);
            const previousMissions = queryClient.getQueryData<Mission[]>([MISSIONS_QUERY_KEY]);

            // Optimistically remove from list
            queryClient.setQueryData<Participation[]>(
                [PARTICIPATIONS_QUERY_KEY, userId],
                (old) => old?.filter((p) => p.missionId !== missionId) ?? []
            );

            // Optimistically restore a spot
            queryClient.setQueryData<Mission[]>([MISSIONS_QUERY_KEY], (old) =>
                old?.map((m) =>
                    m.id === missionId
                        ? { ...m, spotsLeft: m.spotsLeft + 1 }
                        : m
                )
            );

            return { previousParticipations, previousMissions };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousParticipations !== undefined) {
                queryClient.setQueryData(
                    [PARTICIPATIONS_QUERY_KEY, userId],
                    context.previousParticipations
                );
            }
            if (context?.previousMissions !== undefined) {
                queryClient.setQueryData([MISSIONS_QUERY_KEY], context.previousMissions);
            }
        },

        onSuccess: async (_data, { missionId }) => {
            const missions = queryClient.getQueryData<Mission[]>([MISSIONS_QUERY_KEY]);
            const mission = missions?.find((m) => m.id === missionId);
            if (mission) {
                await updateMissionSpots(missionId, mission.spotsLeft);
            }
            await queryClient.invalidateQueries({ queryKey: [PARTICIPATIONS_QUERY_KEY, userId] });
            await queryClient.invalidateQueries({ queryKey: [MISSIONS_QUERY_KEY] });
        },
    });
}
