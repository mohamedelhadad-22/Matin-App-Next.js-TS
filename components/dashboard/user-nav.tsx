'use client';

import { useTranslations } from 'next-intl';
import { User as UserIcon, Settings, LogOut, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/components/providers/auth-provider';

export default function UserNav() {
    const t = useTranslations('DashboardHeader');
    const { user, logout } = useAuth();

    // Dynamic user data with fallbacks
    const displayName = user?.full_name?.trim() || t('userName');
    const displayEmail = user?.email || 'user@matin.com';
    const initials = user?.full_name
        ? user.full_name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : displayName[0].toUpperCase();

    const roleLabel = user?.user_role === 'ADMIN'
        ? t('role_admin')
        : user?.entity_type ? t(user.entity_type) : t('userRole');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-matin-primary/10">
                    <Avatar className="h-8 w-8 border-2 border-matin-primary/20">
                        <AvatarImage src="/avatars/user.png" alt={displayName} />
                        <AvatarFallback className="bg-matin-primary text-white text-sm font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">{displayName}</span>
                        <span className="text-xs text-gray-500">{roleLabel}</span>
                    </div>
                    <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{displayEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Company Profile — only for COMPANY entity type */}
                {user?.entity_type === 'COMPANY' && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard/company/profile" className="flex w-full items-center">
                            <Building2 className="me-2 h-4 w-4" />
                            <span>{t('companyProfile')}</span>
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile" className="flex w-full items-center">
                        <UserIcon className="me-2 h-4 w-4" />
                        <span>{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex w-full items-center">
                        <Settings className="me-2 h-4 w-4" />
                        <span>{t('settings')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={logout}
                >
                    <LogOut className="me-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}