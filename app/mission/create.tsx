// app/mission/create.tsx
import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateMission } from '@/hooks/useMissions';
import { Category } from '@/types';

const CATEGORIES: { label: string; value: Exclude<Category, 'all'>; icon: string }[] = [
    { label: 'Plage', value: 'beach', icon: 'water' },
    { label: 'Forêt', value: 'forest', icon: 'leaf' },
    { label: 'Déchets', value: 'waste', icon: 'trash' },
    { label: 'Éducation', value: 'education', icon: 'school' },
];

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    keyboardType?: 'default' | 'numeric';
}

const InputField = ({ label, value, onChangeText, multiline = false, keyboardType = 'default' }: InputFieldProps) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, multiline && styles.textArea]}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            keyboardType={keyboardType}
            placeholderTextColor="#AABFB8"
        />
    </View>
);

export default function CreateMissionScreen() {
    const router = useRouter();
    const createMissionMutation = useCreateMission();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Exclude<Category, 'all'>>('beach');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [location, setLocation] = useState('');
    const [spots, setSpots] = useState('10');
    const [date, setDate] = useState('2026-05-01');
    const [time, setTime] = useState('09:00');

    const handleCreate = async () => {
        if (!title || !description || !city || !location) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        try {
            await createMissionMutation.mutateAsync({
                title,
                category,
                description,
                longDescription: description, // Simplification
                city,
                location,
                spots: parseInt(spots),
                spotsLeft: parseInt(spots),
                date: new Date(date).toISOString(),
                time,
                imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
                organizer: 'Bénévole EcoAction',
                duration: '3 heures',
                requirements: ['Bonne humeur', 'Gourde d\'eau'],
                tags: [category, city.toLowerCase()],
            });

            Alert.alert('Succès', 'Votre mission a été créée avec succès !', [
                { text: 'Super', onPress: () => router.back() }
            ]);
        } catch (err) {
            Alert.alert('Erreur', 'Impossible de créer la mission.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#1B3A2D" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Proposer une mission</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <InputField label="Titre de la mission" value={title} onChangeText={setTitle} />

                    <Text style={styles.label}>Catégorie</Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.value}
                                style={[styles.catBtn, category === cat.value && styles.catBtnActive]}
                                onPress={() => setCategory(cat.value)}
                            >
                                <Ionicons
                                    name={cat.icon as any}
                                    size={20}
                                    color={category === cat.value ? '#FFF' : '#2D6A4F'}
                                />
                                <Text style={[styles.catLabel, category === cat.value && styles.catLabelActive]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <InputField
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <InputField label="Ville" value={city} onChangeText={setCity} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField label="Places" value={spots} onChangeText={setSpots} keyboardType="numeric" />
                        </View>
                    </View>

                    <InputField label="Lieu précis" value={location} onChangeText={setLocation} />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleCreate}
                        disabled={createMissionMutation.isPending}
                    >
                        {createMissionMutation.isPending ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.submitBtnText}>Publier la mission</Text>
                        )}
                    </TouchableOpacity>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F7F4' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1B3A2D' },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#2D6A4F', marginBottom: 8 },
    input: {
        backgroundColor: '#FFF', borderRadius: 12, padding: 12,
        borderWidth: 1.5, borderColor: '#D8EEE4', color: '#1B3A2D', fontSize: 16,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 10 },
    catBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
        borderWidth: 1.5, borderColor: '#D8EEE4', gap: 6,
    },
    catBtnActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
    catLabel: { fontSize: 14, color: '#2D6A4F', fontWeight: '500' },
    catLabelActive: { color: '#FFF' },
    row: { flexDirection: 'row', marginBottom: 5 },
    submitBtn: {
        backgroundColor: '#2D6A4F', borderRadius: 16, padding: 18,
        alignItems: 'center', marginTop: 10,
        shadowColor: '#1B3A2D', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
