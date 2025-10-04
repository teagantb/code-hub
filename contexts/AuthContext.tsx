"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    image?: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "GET" });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
