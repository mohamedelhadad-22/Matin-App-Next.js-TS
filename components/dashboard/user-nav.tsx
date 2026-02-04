'use client';

import { useTranslations } from 'next-intl';
import { User, Settings, LogOut, ChevronDown, Building2 } from 'lucide-react'; // 👈 ضيفنا أيقونة الشركة
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
import { Link } from '@/i18n/routing'; // 👈 1. استيراد اللينك الذكي

export default function UserNav() {
    const t = useTranslations('DashboardHeader');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-matin-primary/10">
                    <Avatar className="h-8 w-8 border-2 border-matin-primary/20">
                        <AvatarImage src="/avatars/user.png" alt="User" />
                        <AvatarFallback className="bg-matin-primary text-white text-sm font-medium">م</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">{t('userName')}</span>
                        <span className="text-xs text-gray-500">{t('userRole')}</span>
                    </div>
                    <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{t('userName')}</p>
                        <p className="text-xs text-muted-foreground">admin@matin.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* 👈 2. ربط ملف الشركة */}
                {/* استخدمنا asChild عشان نمرر التصميم للينك */}
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/company/profile" className="flex w-full items-center">
                        <Building2 className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                        <span>ملف الشركة</span> {/* ممكن تستخدم t('companyProfile') */}
                    </Link>
                </DropdownMenuItem>

                {/* ربط الملف الشخصي للمستخدم (لو هتعمله مستقبلاً) */}
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile" className="flex w-full items-center">
                        <User className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                        <span>{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex w-full items-center">
                        <Settings className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                        <span>{t('settings')}</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}