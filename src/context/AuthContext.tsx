"use client";

import React, {createContext, useContext, useEffect, useState, ReactNode} from "react";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("modshop_user");
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const login = (email: string) => {
        setUser({email});
        localStorage.setItem("modshop_user", JSON.stringify({email}));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("modshop_user");
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}

