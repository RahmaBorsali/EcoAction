// src/components/MissionCard.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mission } from '@/types';

interface MissionCardProps {
    mission: Mission;
    onPress: () => void;
    isEnrolled?: boolean;
}

const CATEGORY_CONFIG: Record<
    string,
    { icon: string; color: string; bg: string; label: string }
> = {
    beach: { icon: 'water', color: '#0077B6', bg: '#E0F4FF', label: 'Plages' },
    forest: { icon: 'leaf', color: '#2D6A4F', bg: '#D8EEE4', label: 'Forêts' },
    waste: { icon: 'trash', color: '#E07B39', bg: '#FFF0E6', label: 'Déchets' },
    education: { icon: 'school', color: '#6B42A0', bg: '#F0E6FF', label: 'Éducation' },
};

export function MissionCard({ mission, onPress, isEnrolled = false }: MissionCardProps) {
    const cat = CATEGORY_CONFIG[mission.category] ?? CATEGORY_CONFIG['waste'];
    const spotsPercent = Math.round(
        ((mission.spots - mission.spotsLeft) / mission.spots) * 100
    );
    const isFull = mission.spotsLeft === 0;

    const formattedDate = new Date(mission.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.85}
        >
            {/* Category Banner */}
            <View style={[styles.banner, { backgroundColor: cat.bg }]}>
                <View style={[styles.categoryBadge, { backgroundColor: cat.color }]}>
                    <Ionicons name={cat.icon as any} size={12} color="#fff" />
                    <Text style={styles.categoryText}>{cat.label}</Text>
                </View>
                {isEnrolled && (
                    <View style={styles.enrolledBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#2D6A4F" />
                        <Text style={styles.enrolledText}>Inscrit</Text>
                    </View>
                )}
                <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
                    <Ionicons name={cat.icon as any} size={32} color={cat.color} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {mission.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {mission.description}
                </Text>

                {/* Meta row */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={12} color="#636E72" />
                        <Text style={styles.metaText}>{formattedDate}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={12} color="#636E72" />
                        <Text style={styles.metaText} numberOfLines={1}>{mission.city}</Text>
                    </View>
                </View>

                {/* Spots progress */}
                <View style={styles.spotsRow}>
                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${spotsPercent}%`,
                                    backgroundColor: isFull ? '#E07B39' : '#52B788',
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.spotsText, { color: isFull ? '#E07B39' : '#2D6A4F' }]}>
                        {isFull ? 'Complet' : `${mission.spotsLeft} place${mission.spotsLeft > 1 ? 's' : ''}`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#2D6A4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    banner: {
        height: 80,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    categoryText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    enrolledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D8EEE4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    enrolledText: {
        color: '#2D6A4F',
        fontSize: 11,
        fontWeight: '700',
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1B3A2D',
        marginBottom: 4,
        lineHeight: 22,
    },
    description: {
        fontSize: 13,
        color: '#636E72',
        lineHeight: 19,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#636E72',
    },
    spotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#F0F7F4',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        borderRadius: 3,
    },
    spotsText: {
        fontSize: 12,
        fontWeight: '700',
        minWidth: 60,
        textAlign: 'right',
    },
});
