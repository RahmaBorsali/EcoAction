// app/(tabs)/profile.tsx
import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useUserParticipations } from '@/hooks/useParticipations';
import { useMissions } from '@/hooks/useMissions';
import { StatCard } from '@/components/StatCard';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const { data: participations } = useUserParticipations(user?.id ?? '');
    const { data: allMissions } = useMissions();

    const enrolledMissions = (participations ?? []).map((p) =>
        allMissions?.find((m) => m.id === p.missionId)
    ).filter(Boolean);

    const completedCount = enrolledMissions.filter(
        (m) => m && new Date(m.date) < new Date()
    ).length;

    const upcomingCount = enrolledMissions.filter(
        (m) => m && new Date(m.date) >= new Date()
    ).length;

    const totalHours = completedCount * 3; // average 3h per mission
    const totalImpact = completedCount * 5; // average 5kg per mission

    const handleLogout = () => {
        Alert.alert(
            'Se déconnecter',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? '??';

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.headerBg}>
                    <View style={styles.headerContent}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <Text style={styles.name}>{user?.name}</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                        <View style={styles.bioBadge}>
                            <Ionicons name="leaf" size={12} color="#2D6A4F" />
                            <Text style={styles.bioText}>{user?.bio ?? 'Bénévole EcoAction 🌱'}</Text>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <Text style={styles.sectionTitle}>Mes statistiques</Text>
                <View style={styles.statsRow}>
                    <StatCard
                        icon="checkmark-done-circle"
                        value={completedCount}
                        label={'Missions\ncomplétées'}
                        iconColor="#2D6A4F"
                        bgColor="#D8EEE4"
                    />
                    <StatCard
                        icon="calendar"
                        value={upcomingCount}
                        label={'Missions\nà venir'}
                        iconColor="#0077B6"
                        bgColor="#E0F4FF"
                    />
                </View>
                <View style={[styles.statsRow, { marginTop: 10 }]}>
                    <StatCard
                        icon="time"
                        value={`${totalHours}h`}
                        label={'Heures de\nbénévolat'}
                        iconColor="#E07B39"
                        bgColor="#FFF0E6"
                    />
                    <StatCard
                        icon="earth"
                        value={`${totalImpact}kg`}
                        label={'Déchets\ncollectés'}
                        iconColor="#6B42A0"
                        bgColor="#F0E6FF"
                    />
                </View>

                {/* Actions */}
                <Text style={styles.sectionTitle}>Mon compte</Text>
                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/my-missions')} activeOpacity={0.7}>
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#D8EEE4' }]}>
                                <Ionicons name="calendar-outline" size={18} color="#2D6A4F" />
                            </View>
                            <Text style={styles.menuText}>Mes missions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#AABFB8" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#FFF0E6' }]}>
                                <Ionicons name="notifications-outline" size={18} color="#E07B39" />
                            </View>
                            <Text style={styles.menuText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#AABFB8" />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.menuItem}>
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#E0F4FF' }]}>
                                <Ionicons name="shield-checkmark-outline" size={18} color="#0077B6" />
                            </View>
                            <Text style={styles.menuText}>Confidentialité</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#AABFB8" />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Ionicons name="log-out-outline" size={20} color="#E07B39" />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>

                {/* App version */}
                <Text style={styles.version}>EcoAction v1.0.0 · Fait avec 💚</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F7F4' },
    scroll: { paddingBottom: 30 },
    headerBg: {
        backgroundColor: '#2D6A4F',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 30,
    },
    headerContent: { alignItems: 'center', paddingTop: 24, paddingHorizontal: 24 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#52B788', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 3, borderColor: '#D8EEE4',
    },
    avatarText: { fontSize: 28, fontWeight: '900', color: '#fff' },
    name: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
    email: { fontSize: 13, color: '#D8EEE4', marginBottom: 12 },
    bioBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#D8EEE4', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    },
    bioText: { fontSize: 13, color: '#2D6A4F', fontWeight: '600' },
    sectionTitle: {
        fontSize: 16, fontWeight: '800', color: '#1B3A2D',
        marginHorizontal: 20, marginTop: 24, marginBottom: 12,
    },
    statsRow: { flexDirection: 'row', marginHorizontal: 20, gap: 12 },
    menuCard: {
        backgroundColor: '#fff', borderRadius: 20, marginHorizontal: 20,
        shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 16,
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    menuIcon: {
        width: 38, height: 38, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    menuText: { fontSize: 15, fontWeight: '600', color: '#1B3A2D' },
    divider: { height: 1, backgroundColor: '#F0F7F4', marginHorizontal: 16 },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, marginHorizontal: 20, marginTop: 20,
        backgroundColor: '#FFF0E6', borderRadius: 16,
        paddingVertical: 14, borderWidth: 1.5, borderColor: '#F4A261',
    },
    logoutText: { fontSize: 15, fontWeight: '700', color: '#E07B39' },
    version: { textAlign: 'center', fontSize: 12, color: '#AABFB8', marginTop: 20 },
});
