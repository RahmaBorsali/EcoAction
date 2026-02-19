// src/components/CategoryFilter.tsx
import React from 'react';
import {
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/types';

interface CategoryFilterProps {
    selected: Category;
    onSelect: (category: Category) => void;
}

const CATEGORIES: {
    key: Category;
    label: string;
    icon: string;
    color: string;
}[] = [
        { key: 'all', label: 'Toutes', icon: 'apps', color: '#2D6A4F' },
        { key: 'beach', label: 'Plages', icon: 'water', color: '#0077B6' },
        { key: 'forest', label: 'Forêts', icon: 'leaf', color: '#2D6A4F' },
        { key: 'waste', label: 'Déchets', icon: 'trash', color: '#E07B39' },
        { key: 'education', label: 'Éducation', icon: 'school', color: '#6B42A0' },
    ];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.key;
                return (
                    <TouchableOpacity
                        key={cat.key}
                        style={[
                            styles.chip,
                            isSelected && { backgroundColor: cat.color },
                        ]}
                        onPress={() => onSelect(cat.key)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={cat.icon as any}
                            size={14}
                            color={isSelected ? '#fff' : cat.color}
                        />
                        <Text
                            style={[
                                styles.chipText,
                                { color: isSelected ? '#fff' : cat.color },
                            ]}
                        >
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        gap: 6,
        borderWidth: 1.5,
        borderColor: '#D8EEE4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
