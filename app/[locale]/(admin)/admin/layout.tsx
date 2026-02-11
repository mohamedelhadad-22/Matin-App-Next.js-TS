import Sidebar from "@/components/dashboard/Sidebar";
import { redirect } from "@/i18n/routing";
import { authService } from "@/services/auth";
import { User } from "@/types/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Check Security (Server Side)
    const user = await authService.getCurrentUser() as User;

    if (!user || user.role !== 'ADMIN') {
        // if not admin, redirect him out
        redirect({ href: '/auth/login', locale: 'en' });
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 2. Admin Sidebar (Black Theme usually) */}
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}