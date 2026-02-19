// app/(auth)/register.tsx
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showSuccess, setShowSuccess] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!name.trim() || name.trim().length < 2) e.name = 'Nom requis (min. 2 caractères)';
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide';
        if (!password || password.length < 6) e.password = 'Mot de passe requis (min. 6 caractères)';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            await register({ name: name.trim(), email: email.trim().toLowerCase(), password });
            setShowSuccess(true);
        } catch (err: unknown) {
            Alert.alert('Erreur', (err as { message?: string })?.message ?? 'Inscription impossible');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessDone = () => {
        setShowSuccess(false);
        router.replace('/(auth)/login');
    };

    const field = (
        key: string,
        label: string,
        icon: string,
        value: string,
        onChange: (t: string) => void,
        opts?: { secure?: boolean; keyboard?: 'email-address' | 'default'; showToggle?: boolean }
    ) => (
        <View style={styles.fieldWrap}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputRow, errors[key] ? styles.inputError : null]}>
                <Ionicons name={icon as any} size={18} color="#52B788" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(t) => { onChange(t); setErrors((e) => { const c = { ...e }; delete c[key]; return c; }); }}
                    secureTextEntry={opts?.secure ? !showPwd : false}
                    keyboardType={opts?.keyboard ?? 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#AABFB8"
                />
                {opts?.showToggle && (
                    <TouchableOpacity onPress={() => setShowPwd((v) => !v)} style={styles.toggleBtn}>
                        <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color="#636E72" />
                    </TouchableOpacity>
                )}
            </View>
            {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <View style={styles.logoWrap}>
                            <Ionicons name="leaf" size={40} color="#fff" />
                        </View>
                        <Text style={styles.appName}>EcoAction</Text>
                        <Text style={styles.tagline}>Rejoignez la communauté 🌱</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.formTitle}>Créer un compte</Text>
                        {field('name', 'Prénom & Nom', 'person-outline', name, setName)}
                        {field('email', 'Email', 'mail-outline', email, setEmail, { keyboard: 'email-address' })}
                        {field('password', 'Mot de passe', 'lock-closed-outline', password, setPassword, {
                            secure: true,
                            showToggle: true,
                        })}

                        <TouchableOpacity
                            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="person-add-outline" size={20} color="#fff" />
                                    <Text style={styles.submitText}>S'inscrire</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Déjà un compte ? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.loginLink}>Se connecter</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Beautiful Success Modal */}
            <SuccessModal
                visible={showSuccess}
                onClose={handleSuccessDone}
                title="Bienvenue !"
                message="Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
            />
        </SafeAreaView>
    );
}

// Custom Success Modal Component
function SuccessModal({ visible, onClose, title, message }: { visible: boolean, onClose: () => void, title: string, message: string }) {
    return (
        <View style={visible ? styles.modalOverlay : { display: 'none' }}>
            <View style={styles.modalCard}>
                <View style={styles.modalIconWrap}>
                    <Ionicons name="checkmark-circle" size={60} color="#52B788" />
                </View>
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalMsg}>{message}</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
                    <Text style={styles.modalBtnText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#2D6A4F' },
    flex: { flex: 1 },
    scroll: { flexGrow: 1 },
    header: { alignItems: 'center', paddingTop: 32, paddingBottom: 36 },
    logoWrap: {
        width: 80, height: 80, borderRadius: 24,
        backgroundColor: '#52B788', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
    },
    appName: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1 },
    tagline: { fontSize: 14, color: '#D8EEE4', marginTop: 4 },
    card: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        flex: 1, padding: 28, paddingTop: 32,
    },
    formTitle: { fontSize: 24, fontWeight: '800', color: '#1B3A2D', marginBottom: 24 },
    fieldWrap: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: '#2D3436', marginBottom: 8 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#D8EEE4', borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#F0F7F4',
    },
    inputError: { borderColor: '#E07B39' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: '#1B3A2D', padding: 0 },
    errorText: { fontSize: 12, color: '#E07B39', marginTop: 4, marginLeft: 4 },
    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#2D6A4F', borderRadius: 16,
        paddingVertical: 16, gap: 10, marginTop: 8,
        shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    submitBtnDisabled: { opacity: 0.7 },
    submitText: { color: '#fff', fontWeight: '800', fontSize: 16 },
    loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    loginText: { fontSize: 14, color: '#636E72' },
    loginLink: { fontSize: 14, color: '#2D6A4F', fontWeight: '700' },
    toggleBtn: { padding: 4 },
    // Modal Styles
    modalOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    },
    modalCard: {
        backgroundColor: '#fff', width: '85%', borderRadius: 24,
        padding: 30, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
    },
    modalIconWrap: { marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#1B3A2D', marginBottom: 12 },
    modalMsg: { fontSize: 15, color: '#636E72', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    modalBtn: {
        backgroundColor: '#2D6A4F', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14,
        width: '100%', alignItems: 'center',
    },
    modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
