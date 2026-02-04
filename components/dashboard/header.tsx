'use client';

import { useTranslations } from 'next-intl';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from './user-nav';

export default function HeaderSection() {
    const t = useTranslations('DashboardHeader');

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-600 hover:text-matin-primary"
                >
                    <Menu size={24} />
                </Button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder={t('searchPlaceholder')}
                            className="ltr:pl-10 rtl:pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-matin-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-gray-600 hover:text-matin-primary hover:bg-matin-primary/10"
                    >
                        <Bell size={20} />
                        {/* Notification Badge */}
                        <span className="absolute top-1 ltr:right-1 rtl:left-1 w-2 h-2 bg-matin-action rounded-full" />
                    </Button>

                    {/* User Navigation */}
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
