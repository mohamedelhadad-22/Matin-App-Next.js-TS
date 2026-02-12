'use client';

import { useTranslations } from 'next-intl';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from '@/components/dashboard/user-nav';
import { ModeToggle } from "@/components/shared/mode-toggle"

export default function AdminHeader() {
    const t = useTranslations('DashboardHeader');

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 px-6 flex items-center justify-between">
            {/* Left: Title or Search */}
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search users, disputes..."
                        className="ltr:pl-10 rtl:pr-10 h-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-red-500 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <ModeToggle />
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 hover:bg-red-50 relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Button>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <UserNav />
            </div>
        </header>
    );
}