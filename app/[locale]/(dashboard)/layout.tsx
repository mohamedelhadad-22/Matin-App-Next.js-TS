"use client"

import { SidebarProvider, useSidebar } from "@/components/dashboard/sidebar-context"
import Sidebar from "@/components/dashboard/Sidebar"
import HeaderSection from "@/components/dashboard/header"
import { cn } from "@/lib/utils"
import VerificationBanner from "@/components/dashboard/verification-banner"
import { CompanyProvider } from "@/components/providers/company-context"

function DashboardContent({
    children,
}: {
    children: React.ReactNode
}) {
    const { isCollapsed } = useSidebar()

    return (
        <div className="h-full relative bg-gray-50">

            <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar />
            </div>
            <main
                className={cn(
                    "h-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:ps-20" : "md:ps-72"
                )}
            >
                <VerificationBanner />
                <HeaderSection />

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <CompanyProvider>
                <DashboardContent>{children}</DashboardContent>
            </CompanyProvider>
        </SidebarProvider>
    )
}