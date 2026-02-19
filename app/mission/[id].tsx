// app/mission/[id].tsx
import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMission } from '@/hooks/useMissions';
import { useUserParticipations, useEnrollMission, useCancelMission } from '@/hooks/useParticipations';
import { useAuth } from '@/context/AuthContext';
import { ParticipationButton } from '@/components/ParticipationButton';
import { ErrorView } from '@/components/ErrorView';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
    beach: { bg: '#0077B6', text: '#E0F4FF', icon: 'water' },
    forest: { bg: '#2D6A4F', text: '#D8EEE4', icon: 'leaf' },
    waste: { bg: '#E07B39', text: '#FFF0E6', icon: 'trash' },
    education: { bg: '#6B42A0', text: '#F0E6FF', icon: 'school' },
};

export default function MissionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const { data: mission, isLoading, isError, refetch } = useMission(id ?? '');
    const { data: participations } = useUserParticipations(user?.id ?? '');

    const enrollMutation = useEnrollMission(user?.id ?? '');
    const cancelMutation = useCancelMission(user?.id ?? '');

    const participation = participations?.find((p) => p.missionId === id);
    const isEnrolled = Boolean(participation);
    const isFull = (mission?.spotsLeft ?? 0) === 0 && !isEnrolled;
    const isPending = enrollMutation.isPending || cancelMutation.isPending;

    const formattedDate = mission
        ? new Date(mission.date).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '';

    const cat = CATEGORY_COLORS[mission?.category ?? 'waste'];

    const handleEnroll = () => {
        if (!user || !mission) return;
        enrollMutation.mutate(
            { missionId: mission.id },
            {
                onError: () => {
                    Alert.alert('Erreur', 'Inscription impossible. Veuillez réessayer.');
                },
            }
        );
    };

    const handleCancel = () => {
        if (!participation) return;
        Alert.alert(
            'Annuler la participation',
            `Vous allez vous désinscrire de "${mission?.title ?? 'cette mission'}".`,
            [
                { text: 'Garder', style: 'cancel' },
                {
                    text: 'Annuler',
                    style: 'destructive',
                    onPress: () => {
                        cancelMutation.mutate(
                            { participationId: participation.id, missionId: participation.missionId },
                            { onError: () => Alert.alert('Erreur', 'Annulation impossible.') }
                        );
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2D6A4F" />
                </View>
            </SafeAreaView>
        );
    }

    if (isError || !mission) {
        return (
            <SafeAreaView style={styles.safe}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1B3A2D" />
                </TouchableOpacity>
                <ErrorView onRetry={() => void refetch()} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Custom Header */}
            <View style={[styles.heroHeader, { backgroundColor: cat.bg }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.heroContent}>
                    <View style={[styles.heroCategoryChip, { backgroundColor: cat.text + '33' }]}>
                        <Ionicons name={cat.icon as any} size={14} color="#fff" />
                        <Text style={styles.heroCategoryText}>
                            {mission.category.charAt(0).toUpperCase() + mission.category.slice(1)}
                        </Text>
                    </View>
                    <Text style={styles.heroTitle}>{mission.title}</Text>
                    <Text style={styles.heroOrganizer}>par {mission.organizer}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Quick Info Chips */}
                <View style={styles.chipsRow}>
                    <View style={styles.chip}>
                        <Ionicons name="calendar-outline" size={14} color="#2D6A4F" />
                        <Text style={styles.chipText}>{formattedDate}</Text>
                    </View>
                    <View style={styles.chip}>
                        <Ionicons name="time-outline" size={14} color="#2D6A4F" />
                        <Text style={styles.chipText}>{mission.time} · {mission.duration}</Text>
                    </View>
                </View>
                <View style={[styles.chipsRow, { marginTop: 8 }]}>
                    <View style={styles.chip}>
                        <Ionicons name="location-outline" size={14} color="#2D6A4F" />
                        <Text style={styles.chipText}>{mission.location}, {mission.city}</Text>
                    </View>
                </View>

                {/* Spots indicator */}
                <View style={styles.spotsCard}>
                    <View style={styles.spotsInfo}>
                        <Text style={styles.spotsNum}>{mission.spotsLeft}</Text>
                        <Text style={styles.spotsLabel}>places restantes sur {mission.spots}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${Math.round(((mission.spots - mission.spotsLeft) / mission.spots) * 100)}%`,
                                    backgroundColor: mission.spotsLeft === 0 ? '#E07B39' : '#52B788',
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Enrolled confirmation */}
                {isEnrolled && (
                    <View style={styles.enrolledBanner}>
                        <Ionicons name="checkmark-circle" size={20} color="#2D6A4F" />
                        <Text style={styles.enrolledBannerText}>Vous êtes inscrit à cette mission ! 🎉</Text>
                    </View>
                )}

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionBody}>{mission.longDescription || mission.description}</Text>
                </View>

                {/* Requirements */}
                {mission.requirements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ce qu'il faut apporter</Text>
                        {mission.requirements.map((req, index) => (
                            <View key={index} style={styles.requirementRow}>
                                <Ionicons name="checkmark" size={15} color="#52B788" />
                                <Text style={styles.requirementText}>{req}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Tags */}
                {mission.tags.length > 0 && (
                    <View style={styles.tagsWrap}>
                        {mission.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* CTA - fixed at bottom */}
            <View style={styles.ctaWrap}>
                <ParticipationButton
                    isEnrolled={isEnrolled}
                    isFull={isFull}
                    isPending={isPending}
                    onEnroll={handleEnroll}
                    onCancel={handleCancel}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F7F4' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    heroHeader: {
        paddingBottom: 28, paddingHorizontal: 20,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        marginTop: 8, marginBottom: 12,
    },
    heroContent: {},
    heroCategoryChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
        marginBottom: 10,
    },
    heroCategoryText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 30, marginBottom: 6 },
    heroOrganizer: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
    scroll: { paddingBottom: 20 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginTop: 16 },
    chip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#fff', borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 8,
        borderWidth: 1.5, borderColor: '#D8EEE4',
        shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    chipText: { fontSize: 13, color: '#2D6A4F', fontWeight: '500' },
    spotsCard: {
        backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 16,
        padding: 16,
        shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    },
    spotsInfo: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 10 },
    spotsNum: { fontSize: 28, fontWeight: '900', color: '#1B3A2D' },
    spotsLabel: { fontSize: 13, color: '#636E72' },
    progressBarBg: {
        height: 8, backgroundColor: '#F0F7F4', borderRadius: 4, overflow: 'hidden',
    },
    progressBarFill: { height: 8, borderRadius: 4 },
    enrolledBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#D8EEE4', borderRadius: 14, marginHorizontal: 16, marginTop: 14,
        padding: 14,
    },
    enrolledBannerText: { fontSize: 14, color: '#2D6A4F', fontWeight: '700', flex: 1 },
    section: { marginHorizontal: 16, marginTop: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1B3A2D', marginBottom: 10 },
    sectionBody: { fontSize: 15, color: '#2D3436', lineHeight: 24 },
    requirementRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    requirementText: { fontSize: 14, color: '#2D3436', flex: 1, lineHeight: 20 },
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginTop: 16 },
    tag: {
        backgroundColor: '#D8EEE4', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
    },
    tagText: { fontSize: 12, color: '#2D6A4F', fontWeight: '600' },
    ctaWrap: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#F0F7F4', paddingBottom: 24, paddingTop: 12,
        borderTopWidth: 1, borderTopColor: '#D8EEE4',
    },
});
