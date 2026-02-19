// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { login } = useAuth();
    const router = useRouter();

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) newErrors.email = 'L\'email est requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email invalide';
        if (!password) newErrors.password = 'Le mot de passe est requis';
        else if (password.length < 4) newErrors.password = 'Minimum 4 caractères';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            await login({ email: email.trim().toLowerCase(), password });
            router.replace('/(tabs)');
        } catch (err: unknown) {
            const msg = (err as { message?: string })?.message ?? 'Connexion impossible';
            Alert.alert('Erreur', msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoWrap}>
                            <Ionicons name="leaf" size={40} color="#fff" />
                        </View>
                        <Text style={styles.appName}>EcoAction</Text>
                        <Text style={styles.tagline}>Ensemble pour la planète 🌍</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.card}>
                        <Text style={styles.formTitle}>Connexion</Text>

                        {/* Email */}
                        <View style={styles.fieldWrap}>
                            <Text style={styles.label}>Email</Text>
                            <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
                                <Ionicons name="mail-outline" size={18} color="#52B788" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="votre@email.com"
                                    placeholderTextColor="#AABFB8"
                                    value={email}
                                    onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldWrap}>
                            <Text style={styles.label}>Mot de passe</Text>
                            <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#52B788" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#AABFB8"
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#636E72" />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="log-in-outline" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Se connecter</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Demo account hint */}
                        <View style={styles.hintBox}>
                            <Ionicons name="information-circle-outline" size={14} color="#52B788" />
                            <Text style={styles.hintText}>Compte démo : demo@ecoaction.fr / demo123</Text>
                        </View>

                        {/* Register link */}
                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>Pas encore inscrit ? </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.registerLink}>Créer un compte</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
    hintBox: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F0F7F4', borderRadius: 10, padding: 10, marginTop: 14,
    },
    hintText: { fontSize: 12, color: '#2D6A4F', flex: 1 },
    registerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    registerText: { fontSize: 14, color: '#636E72' },
    registerLink: { fontSize: 14, color: '#2D6A4F', fontWeight: '700' },
});
