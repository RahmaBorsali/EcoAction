// src/components/LoadingCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

function SkeletonBox({ style }: { style?: object }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[styles.skeleton, style, { opacity }]}
        />
    );
}

export function LoadingCard() {
    return (
        <View style={styles.card}>
            <SkeletonBox style={styles.banner} />
            <View style={styles.content}>
                <SkeletonBox style={styles.titleLine} />
                <SkeletonBox style={styles.bodyLine1} />
                <SkeletonBox style={styles.bodyLine2} />
                <View style={styles.metaRow}>
                    <SkeletonBox style={styles.metaItem} />
                    <SkeletonBox style={styles.metaItem} />
                </View>
            </View>
        </View>
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
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    banner: {
        height: 80,
        backgroundColor: '#D8EEE4',
        borderRadius: 0,
    },
    content: {
        padding: 14,
    },
    skeleton: {
        backgroundColor: '#D8EEE4',
        borderRadius: 8,
    },
    titleLine: {
        height: 18,
        width: '70%',
        marginBottom: 8,
    },
    bodyLine1: {
        height: 13,
        width: '100%',
        marginBottom: 6,
    },
    bodyLine2: {
        height: 13,
        width: '80%',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
    },
    metaItem: {
        height: 12,
        width: 80,
    },
});
