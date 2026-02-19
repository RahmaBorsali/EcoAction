// src/components/StatCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
    iconColor: string;
    bgColor: string;
}

export function StatCard({ icon, value, label, iconColor, bgColor }: StatCardProps) {
    return (
        <View style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: bgColor }]}>
                <Ionicons name={icon as any} size={22} color={iconColor} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#2D6A4F',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    value: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1B3A2D',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#636E72',
        textAlign: 'center',
        lineHeight: 17,
        fontWeight: '500',
    },
});
