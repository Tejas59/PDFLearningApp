/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User) => void;
    setError: (error: any) => void;
    logout: () => void;
}


export const userAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,

            setUser: (user) => set({ user, isAuthenticated: true }),
            setError: (error) => set({ error }),
            logout: () => set({ user: null, isAuthenticated: false }), 

        }),
        {
            name: "user-storage",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)