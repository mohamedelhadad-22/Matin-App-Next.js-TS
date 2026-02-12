"use client"

import { useTranslations } from "next-intl"
import { useAuth } from "@/components/providers/auth-provider"
import { Calendar } from "lucide-react"

export function WelcomeHeader() {
    const t = useTranslations("dashboard.overview")
    const { user } = useAuth()

    // Format date based on locale if possible, or just default to EN for now
    // Ideally we get locale from params or context, but for client component we can stick to browser or pass it down.
    // Let's use a simple format for now.
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-matin-primary to-matin-secondary">
                    {t("welcome", { name: user?.full_name || "User" })} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t("subtitle")}
                </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                <Calendar className="w-4 h-4 text-matin-primary" />
                <span>{date}</span>
            </div>
        </div>
    )
}
