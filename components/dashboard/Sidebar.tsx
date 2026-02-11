'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { getNavItems } from '@/config/dashboard';
import {
    ChevronLeft,
    ChevronRight,
    Languages,
    LogOut
} from 'lucide-react';
import { useSidebar } from '@/components/dashboard/sidebar-context';
import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';

/** Generate initials from a full name or email */
function getInitials(fullName?: string, email?: string): string {
    if (fullName && fullName.trim()) {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }
    // Fallback to email first char
    if (email) return email[0].toUpperCase();
    return '?';
}

export default function Sidebar() {
    const t = useTranslations('dashboard.sidebar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const { isCollapsed, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth();

    // get the list based on the user (filtered by entity_type)
    const routes = getNavItems(user);

    const isActive = (path: string) => pathname === path;

    const toggleLanguage = () => {
        const nextLocale = locale === 'ar' ? 'en' : 'ar';
        router.replace(pathname, { locale: nextLocale });
    };

    // if no user (still loading), return null
    if (!user) return null;

    // Display name with fallback
    const displayName = user.full_name?.trim() || user.email;
    const initials = getInitials(user.full_name, user.email);

    // Entity type label (translated)
    const entityLabel = user.entity_type === 'COMPANY' ? t('entity_company') : t('entity_individual');

    return (
        <aside
            className={cn(
                "relative h-screen bg-matin-primary text-white transition-all duration-300 ease-in-out flex flex-col border-e-4 border-matin-action",
                isCollapsed ? 'w-20 max-w-20' : 'w-72 max-w-72'
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={cn(
                    "absolute top-9 bg-matin-action text-white p-1 rounded-full shadow-lg hover:bg-orange-600 transition z-50",
                    "ltr:-right-3 rtl:-left-3"
                )}
                aria-label="Toggle Sidebar"
            >
                {/* In RTL the chevron should flip direction */}
                {isCollapsed
                    ? <ChevronRight size={16} className="rtl:rotate-180" />
                    : <ChevronLeft size={16} className="rtl:rotate-180" />
                }
            </button>

            {/* Brand Section */}
            <div className={cn("flex items-center gap-3 p-6 mb-4 h-20", isCollapsed ? 'justify-center' : '')}>

                {/* Logo Icon (Collapsed) */}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-matin-action font-bold shrink-0 animate-fade-in">
                        {locale === 'ar' ? 'م' : 'M'}
                    </div>
                )}

                {/* Full Logo (Expanded) */}
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap animate-fade-in">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-1">
                            {locale === 'ar' ? 'مَتين' : 'Matin'}
                            <span className="text-matin-action">.</span>

                            {/* User Role Badge */}
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal uppercase">
                                {user.role === 'ADMIN' ? t('role_admin') : (user.entity_type === 'COMPANY' ? t('role_vendor') : t('role_tenant'))}
                            </span>
                        </h1>
                        <p className="text-[10px] text-matin-secondary opacity-80 mt-1">
                            {locale === 'ar' ? 'تأجير المعدات الثقيلة' : 'Heavy Equipment Rental'}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Loop */}
            <nav className="flex flex-col gap-2 px-3 flex-1 overflow-y-auto custom-scrollbar">
                {routes.map((route: any) => (
                    <SidebarItem
                        key={route.href}
                        href={route.href}
                        icon={<route.icon size={20} />}
                        text={t(route.title)}
                        active={isActive(route.href)}
                        collapsed={isCollapsed}
                        color={route.color}
                    />
                ))}
            </nav>

            {/* Footer Actions (Language & User Profile) */}
            <div className="p-3 border-t border-white/10 mt-auto flex flex-col gap-2">

                {/* Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-matin-secondary hover:bg-white/10 hover:text-white transition-all duration-300",
                        isCollapsed ? 'justify-center' : ''
                    )}
                >
                    <Languages size={20} />
                    {!isCollapsed && (
                        <span className="font-medium text-sm">
                            {locale === 'ar' ? 'English' : 'العربية'}
                        </span>
                    )}
                </button>

                {/* User Profile / Logout */}
                <div className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg bg-black/20",
                    isCollapsed ? 'justify-center p-2' : ''
                )}>
                    {/* Dynamic Avatar with Initials */}
                    <div className="w-8 h-8 rounded-full bg-matin-action flex items-center justify-center text-white font-bold shrink-0 text-sm">
                        {initials}
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-white">{displayName}</p>
                            <p className="text-[10px] text-gray-400 truncate">{entityLabel}</p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button onClick={logout} className="text-gray-400 hover:text-red-500 transition">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>

            </div>
        </aside>
    );
}

// Reusable Nav Item
function SidebarItem({ href, icon, text, active, collapsed, color }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group relative",
                active
                    ? 'bg-white/20 text-white font-bold shadow-sm'
                    : 'text-matin-secondary hover:bg-white/10 hover:text-white',
                collapsed ? 'justify-center' : ''
            )}
        >
            {/* Icon */}
            <span className={cn("shrink-0 transition-colors", !active && color ? color : "")}>
                {icon}
            </span>

            {/* Text */}
            {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden animate-fade-in text-sm">
                    {text}
                </span>
            )}

            {/* Tooltip for collapsed sidebar */}
            {collapsed && (
                <div className={cn(
                    "absolute bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none shadow-md",
                    "ltr:left-14 rtl:right-14"
                )}>
                    {text}
                </div>
            )}
        </Link>
    );
}