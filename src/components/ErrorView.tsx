// src/components/ErrorView.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorViewProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorView({
    message = 'Une erreur est survenue',
    onRetry,
}: ErrorViewProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name="wifi-outline" size={44} color="#E07B39" />
            </View>
            <Text style={styles.title}>Oups !</Text>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.85}>
                    <Ionicons name="refresh" size={16} color="#fff" />
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    iconWrap: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#FFF0E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1B3A2D',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#636E72',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 24,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#2D6A4F',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },
    retryText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});
