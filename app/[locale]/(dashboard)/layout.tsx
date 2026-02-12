'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/components/providers/auth-provider';
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderSection from '@/components/dashboard/header';
import VerificationBanner from '@/components/dashboard/verification-banner';
import { CompanyProvider } from '@/components/providers/company-context';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. الكمبوننت الداخلي المتفاعل
function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const { user } = useAuth();

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            {/* السايدبار الثابت */}
            <div className="hidden md:flex flex-col fixed inset-y-0 z-[80] h-full">
                <Sidebar />
            </div>

            {/* الجسم المتحرك */}
            <main
                className={cn(
                    "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "md:ps-20" : "md:ps-72"
                )}
            >
                {/* البانر يظهر فقط للمستخدمين (مش للأدمن) */}
                {user?.user_role !== 'ADMIN' && <VerificationBanner />}

                <HeaderSection />

                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (user?.user_role === 'ADMIN') {
            router.replace('/admin');
        } else {
            setIsAuthorized(true);
        }
    }, [user, isLoading, router]);

    if (isLoading || !isAuthorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-matin-primary" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <CompanyProvider>
                <DashboardContent>{children}</DashboardContent>
            </CompanyProvider>
        </SidebarProvider>
    );
}