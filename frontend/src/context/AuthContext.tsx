
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import { getMe, User } from "@/util/authApi";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // We use React Query to fetch the user session on app load!
    // Since it uses apiFetch under the hood, if the access token is expired, 
    // it will automatically try to refresh it.
    const { data: user, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: getMe,
        retry: false, // Don't keep retrying if they are genuinely logged out
    });

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                isAuthenticated: !!user,
            }}
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
