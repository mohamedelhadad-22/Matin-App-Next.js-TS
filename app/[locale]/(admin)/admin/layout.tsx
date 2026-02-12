'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/components/providers/auth-provider';
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderSection from '@/components/dashboard/header';
import { Loader2 } from 'lucide-react';
import { CompanyProvider } from '@/components/providers/company-context';
import { cn } from '@/lib/utils';

// 1. كمبوننت داخلي: ده اللي بيسمع للسايدبار وبيتحرك معاه
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar(); // دلوقتي نقدر نستخدم الهوك هنا

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* السايدبار ثابت في مكانه */}
            <div className="hidden md:flex flex-col fixed inset-y-0 z-50 h-full">
                <Sidebar />
            </div>

            {/* المحتوى الرئيسي: بيوسع ويضيق حسب حالة السايدبار */}
            <div
                className={cn(
                    "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out",
                    // هنا السحر: لو مقفول سيب مسافة صغيرة، لو مفتوح سيب مسافة كبيرة
                    // ps = padding-start (بيشتغل صح عربي وإنجليزي)
                    isCollapsed ? "md:ps-20" : "md:ps-72"
                )}
            >
                <HeaderSection />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}

// 2. الكمبوننت الرئيسي: ده للحماية والـ Providers بس
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        if (!user || user.user_role !== 'ADMIN') {
            router.replace('/dashboard');
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
                {/* بنرمي المحتوى للكمبوننت الداخلي عشان يقدر يحس بالتغيير */}
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </CompanyProvider>
        </SidebarProvider>
    );
}