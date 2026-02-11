"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "@/i18n/routing"
import { User } from "@/types/auth"
import { authService } from "@/services/auth"
import { Loader2 } from "lucide-react"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (token: string, user: User) => void
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    const refreshUser = async () => {
        try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
        } catch (error) {
            console.error("Failed to refresh user", error)
            logout()
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                setIsLoading(false)
                if (!pathname.includes('/auth')) {
                    router.replace('/auth/login')
                }
                return
            }

            try {
                await refreshUser()
            } catch (error) {
                logout()
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = (token: string, newUser: User) => {
        localStorage.setItem('token', token)
        setUser(newUser)

        // التوجيه الذكي: لو معندوش شركة يروح Onboarding
        if (!newUser.company_id) {
            router.push('/auth/onboarding')
        } else {
            router.push('/dashboard')
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        router.replace('/auth/login')
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-matin-primary" />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}