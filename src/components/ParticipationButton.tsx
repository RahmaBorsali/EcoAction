// src/components/ParticipationButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ParticipationButtonProps {
    isEnrolled: boolean;
    isFull: boolean;
    isPending: boolean;
    onEnroll: () => void;
    onCancel: () => void;
}

export function ParticipationButton({
    isEnrolled,
    isFull,
    isPending,
    onEnroll,
    onCancel,
}: ParticipationButtonProps) {
    if (isPending) {
        return (
            <View style={[styles.btn, styles.pendingBtn]}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.btnText}>En cours...</Text>
            </View>
        );
    }

    if (isEnrolled) {
        return (
            <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onCancel}
                activeOpacity={0.85}
            >
                <Ionicons name="close-circle-outline" size={20} color="#E07B39" />
                <Text style={[styles.btnText, { color: '#E07B39' }]}>Annuler ma participation</Text>
            </TouchableOpacity>
        );
    }

    if (isFull) {
        return (
            <View style={[styles.btn, styles.fullBtn]}>
                <Ionicons name="lock-closed-outline" size={20} color="#636E72" />
                <Text style={[styles.btnText, { color: '#636E72' }]}>Mission complète</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.btn, styles.enrollBtn]}
            onPress={onEnroll}
            activeOpacity={0.85}
        >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>S'inscrire à cette mission</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        marginHorizontal: 16,
    },
    enrollBtn: {
        backgroundColor: '#2D6A4F',
        shadowColor: '#2D6A4F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    cancelBtn: {
        backgroundColor: '#FFF0E6',
        borderWidth: 1.5,
        borderColor: '#E07B39',
    },
    fullBtn: {
        backgroundColor: '#F0F0F0',
    },
    pendingBtn: {
        backgroundColor: '#52B788',
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
