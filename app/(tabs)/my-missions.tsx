// app/(tabs)/my-missions.tsx
import React from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    Alert, RefreshControl, ListRenderItemInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useUserParticipations, useCancelMission } from '@/hooks/useParticipations';
import { useMissions } from '@/hooks/useMissions';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { LoadingCard } from '@/components/LoadingCard';
import { Mission, Participation } from '@/types';

interface EnrolledMission {
    participation: Participation;
    mission: Mission;
}

export default function MyMissionsScreen() {
    const { user } = useAuth();
    const router = useRouter();

    const {
        data: participations,
        isLoading: loadingPartics,
        isError: errorPartics,
        refetch: refetchP,
        isRefetching,
    } = useUserParticipations(user?.id ?? '');

    const { data: allMissions, isLoading: loadingMissions } = useMissions();
    const cancelMutation = useCancelMission(user?.id ?? '');

    const isLoading = loadingPartics || loadingMissions;

    const enrolledMissions: EnrolledMission[] = (participations ?? [])
        .map((p) => {
            const mission = allMissions?.find((m) => m.id === p.missionId);
            return mission ? { participation: p, mission } : null;
        })
        .filter((item): item is EnrolledMission => item !== null);

    const upcoming = enrolledMissions.filter(
        (e) => new Date(e.mission.date) >= new Date()
    );
    const past = enrolledMissions.filter(
        (e) => new Date(e.mission.date) < new Date()
    );

    const handleCancel = (participation: Participation, missionTitle: string) => {
        Alert.alert(
            'Annuler la participation',
            `Êtes-vous sûr de vouloir vous désinscrire de "${missionTitle}" ?`,
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Oui, annuler',
                    style: 'destructive',
                    onPress: () => {
                        cancelMutation.mutate({
                            participationId: participation.id,
                            missionId: participation.missionId,
                        });
                    },
                },
            ]
        );
    };

    const renderMissionRow = ({ item }: ListRenderItemInfo<EnrolledMission>) => {
        const { participation, mission } = item;
        const isPast = new Date(mission.date) < new Date();
        const formattedDate = new Date(mission.date).toLocaleDateString('fr-FR', {
            weekday: 'short', day: 'numeric', month: 'long',
        });

        return (
            <TouchableOpacity
                style={styles.missionRow}
                onPress={() => router.push(`/mission/${mission.id}`)}
                activeOpacity={0.85}
            >
                <View style={[styles.dateBar, { backgroundColor: isPast ? '#F0F0F0' : '#D8EEE4' }]}>
                    <Text style={[styles.dateText, { color: isPast ? '#636E72' : '#2D6A4F' }]}>
                        {formattedDate} · {mission.time}
                    </Text>
                </View>

                <View style={styles.rowContent}>
                    <View style={styles.rowLeft}>
                        <Text style={styles.rowTitle} numberOfLines={1}>{mission.title}</Text>
                        <View style={styles.rowMeta}>
                            <Ionicons name="location-outline" size={12} color="#636E72" />
                            <Text style={styles.rowMetaText}>{mission.city}</Text>
                            <Ionicons name="time-outline" size={12} color="#636E72" />
                            <Text style={styles.rowMetaText}>{mission.duration}</Text>
                        </View>
                    </View>

                    {!isPast && (
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => handleCancel(participation, mission.title)}
                        >
                            <Ionicons name="close" size={16} color="#E07B39" />
                        </TouchableOpacity>
                    )}

                    {isPast && (
                        <View style={styles.doneBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#52B788" />
                            <Text style={styles.doneText}>Fait</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (errorPartics) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}><Text style={styles.headerTitle}>Mes Missions</Text></View>
                <ErrorView onRetry={() => void refetchP()} />
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}><Text style={styles.headerTitle}>Mes Missions</Text></View>
                {[1, 2, 3].map((i) => <LoadingCard key={i} />)}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                data={[]}
                renderItem={null}
                keyExtractor={(_, i) => String(i)}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => void refetchP()}
                        colors={['#2D6A4F']}
                        tintColor="#2D6A4F"
                    />
                }
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Mes Missions</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{upcoming.length}</Text>
                            </View>
                        </View>

                        {enrolledMissions.length === 0 ? (
                            <EmptyState
                                icon="calendar-outline"
                                title="Aucune mission à venir"
                                subtitle="Explorez les missions disponibles et inscrivez-vous !"
                            />
                        ) : (
                            <View>
                                {/* Upcoming */}
                                {upcoming.length > 0 && (
                                    <View>
                                        <Text style={styles.sectionTitle}>
                                            <Ionicons name="time-outline" size={14} color="#2D6A4F" /> À venir ({upcoming.length})
                                        </Text>
                                        {upcoming.map((item) => renderMissionRow({ item, index: 0, separators: {} as any }))}
                                    </View>
                                )}

                                {/* Past */}
                                {past.length > 0 && (
                                    <View>
                                        <Text style={styles.sectionTitle}>
                                            <Ionicons name="checkmark-done-outline" size={14} color="#52B788" /> Complétées ({past.length})
                                        </Text>
                                        {past.map((item) => renderMissionRow({ item, index: 0, separators: {} as any }))}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F7F4' },
    listContent: { paddingBottom: 20 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    },
    headerTitle: { fontSize: 26, fontWeight: '900', color: '#1B3A2D' },
    countBadge: {
        backgroundColor: '#2D6A4F', borderRadius: 12,
        paddingHorizontal: 10, paddingVertical: 3,
    },
    countText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    sectionTitle: {
        fontSize: 14, fontWeight: '700', color: '#2D6A4F',
        marginHorizontal: 20, marginTop: 12, marginBottom: 6,
    },
    missionRow: {
        backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 16, marginVertical: 5,
        shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07,
        shadowRadius: 10, elevation: 3, overflow: 'hidden',
    },
    dateBar: { paddingHorizontal: 14, paddingVertical: 6 },
    dateText: { fontSize: 12, fontWeight: '600' },
    rowContent: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 14, paddingVertical: 12,
    },
    rowLeft: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: '700', color: '#1B3A2D', marginBottom: 4 },
    rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowMetaText: { fontSize: 12, color: '#636E72' },
    cancelBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#FFF0E6', alignItems: 'center', justifyContent: 'center',
    },
    doneBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#D8EEE4', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
    },
    doneText: { fontSize: 12, color: '#2D6A4F', fontWeight: '700' },
});
