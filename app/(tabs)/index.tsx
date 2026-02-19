// app/(tabs)/index.tsx - Explore screen
import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, RefreshControl, ListRenderItemInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useMissions } from '@/hooks/useMissions';
import { useUserParticipations } from '@/hooks/useParticipations';
import { useAuth } from '@/context/AuthContext';
import { MissionCard } from '@/components/MissionCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { LoadingCard } from '@/components/LoadingCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { Category, Mission } from '@/types';

export default function ExploreScreen() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    const {
        data: missions,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useMissions(selectedCategory, searchQuery);

    const { data: participations } = useUserParticipations(user?.id ?? '');

    const enrolledMissionIds = new Set(
        participations?.map((p) => p.missionId) ?? []
    );

    const handleMissionPress = useCallback((id: string) => {
        router.push(`/mission/${id}`);
    }, [router]);

    const renderItem = ({ item }: ListRenderItemInfo<Mission>) => (
        <MissionCard
            mission={item}
            onPress={() => handleMissionPress(item.id)}
            isEnrolled={enrolledMissionIds.has(item.id)}
        />
    );

    const renderHeader = () => (
        <View>
            {/* Page header */}
            <View style={styles.pageHeader}>
                <View>
                    <Text style={styles.greeting}>Bonjour, {user?.name?.split(' ')[0]} 👋</Text>
                    <Text style={styles.subtitle}>Trouvez votre prochaine mission</Text>
                </View>
                <View style={styles.avatarCircle}>
                    <Ionicons name="leaf" size={22} color="#2D6A4F" />
                </View>
            </View>

            {/* Search */}
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            {/* Categories */}
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Results count */}
            {!isLoading && !isError && missions && (
                <Text style={styles.resultsCount}>
                    {missions.length} mission{missions.length !== 1 ? 's' : ''} disponible{missions.length !== 1 ? 's' : ''}
                </Text>
            )}
        </View>
    );

    if (isError) {
        return (
            <SafeAreaView style={styles.safe}>
                {renderHeader()}
                <ErrorView
                    message={error?.message ?? 'Impossible de charger les missions'}
                    onRetry={() => void refetch()}
                />
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                {renderHeader()}
                <View style={styles.list}>
                    {[1, 2, 3, 4].map((i) => <LoadingCard key={i} />)}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                data={missions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <EmptyState
                        icon="search-outline"
                        title="Aucune mission trouvée"
                        subtitle="Essayez une autre catégorie ou modifiez votre recherche"
                    />
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => void refetch()}
                        colors={['#2D6A4F']}
                        tintColor="#2D6A4F"
                    />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F7F4' },
    pageHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
    },
    greeting: { fontSize: 22, fontWeight: '800', color: '#1B3A2D' },
    subtitle: { fontSize: 13, color: '#636E72', marginTop: 2 },
    avatarCircle: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#D8EEE4', alignItems: 'center', justifyContent: 'center',
    },
    resultsCount: {
        fontSize: 13, color: '#636E72', marginHorizontal: 20, marginTop: 4, marginBottom: 4,
        fontWeight: '500',
    },
    list: { paddingBottom: 20 },
});
