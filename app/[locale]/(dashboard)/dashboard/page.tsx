"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { CompanyDashboard } from "@/components/dashboard/company/company-overview"
import { IndividualDashboard } from "@/components/dashboard/individual/individual-overview"
import { WelcomeHeader } from "@/components/shared/welcome-header"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-matin-primary" />
            </div>
        )
    }

    // Determine dashboard type based on user entity_type or role
    // 'COMPANY' entities or 'SUPPLIER' roles get the Company Dashboard
    const isCompany = user?.entity_type === 'COMPANY' || user?.role === 'SUPPLIER'

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <WelcomeHeader />
            {isCompany ? (
                <CompanyDashboard />
            ) : (
                <IndividualDashboard />
            )}
        </div>
    )
}