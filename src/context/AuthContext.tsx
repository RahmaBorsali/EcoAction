import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser } from '@/api/auth';
import {
    ApiError,
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '@/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'ecoaction_user';
const TOKEN_KEY = 'ecoaction_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync(USER_KEY);
                if (storedUser) {
                    setUser(JSON.parse(storedUser) as User);
                }
            } catch {
                // ignore storage errors on mount
            } finally {
                setIsLoading(false);
            }
        };
        void loadStoredUser();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response: AuthResponse = await loginUser(credentials);
        setUser(response.user);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        await registerUser(credentials);
        // We don't call setUser here because the user should log in manually after signup
    }, []);

    const logout = useCallback(async () => {
        setUser(null);
        await SecureStore.deleteItemAsync(USER_KEY);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        void SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
