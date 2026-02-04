'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { dashboardConfig } from '@/config/dashboard';
import {
    ChevronLeft,
    ChevronRight,
    Languages
} from 'lucide-react';
import { useSidebar } from '@/components/dashboard/sidebar-context';

const CURRENT_ROLE: "vendor" | "tenant" | "admin" = "vendor";

export default function Sidebar() {
    const t = useTranslations('dashboard.sidebar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const { isCollapsed, toggleSidebar } = useSidebar();

    const routes = dashboardConfig[CURRENT_ROLE] || dashboardConfig.tenant;

    const isActive = (path: string) => pathname === path;

    const toggleLanguage = () => {
        const nextLocale = locale === 'ar' ? 'en' : 'ar';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <aside
            className={`
                relative h-screen bg-matin-primary text-white 
                transition-all duration-300 ease-in-out flex flex-col
                border-e-4 border-matin-action
                ${isCollapsed ? 'w-20 max-w-20' : 'w-72 max-w-72'} 
            `}
        >
            <button
                onClick={toggleSidebar}
                className={`
                  absolute top-9 bg-matin-action text-white p-1 rounded-full shadow-lg 
                  hover:bg-orange-600 transition z-50
                  ltr:-right-3 
                  rtl:-left-3
                  rtl:rotate-180
                `}
                aria-label="Toggle Sidebar"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Brand Section */}
            <div className={`flex items-center gap-3 p-6 mb-4 h-20 ${isCollapsed ? 'justify-center' : ''}`}>

                {/* if it closed */}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-matin-action font-bold shrink-0 animate-fade-in">
                        {locale === 'ar' ? 'م' : 'M'}
                    </div>
                )}

                {/* if it open [All logo text + role + subtitle] */}
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap animate-fade-in">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-1">
                            {locale === 'ar' ? 'مَتين' : 'Matin'}
                            <span className="text-matin-action">.</span>

                            {/* add small badge to show the role */}
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">
                                {t(`role_${CURRENT_ROLE}`)}
                            </span>
                        </h1>
                        <p className="text-[10px] text-matin-secondary opacity-80 mt-1">
                            {/* subtitle */}
                            Heavy Equipment Rental
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Loop */}
            <nav className="flex flex-col gap-2 px-3 flex-1">
                {routes.map((route: any) => (
                    <SidebarItem
                        key={route.href}
                        href={route.href}
                        // convert icon component to jsx and give it size
                        icon={<route.icon size={20} />}
                        // translate title using key from config
                        text={t(route.title)}
                        active={isActive(route.href)}
                        collapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* Language Switcher */}
            <div className="p-3 border-t border-white/10 mt-auto">
                <button
                    onClick={toggleLanguage}
                    className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-matin-secondary 
                        hover:bg-white/10 hover:text-white transition-all duration-300
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                >
                    <Languages size={20} />

                    {!isCollapsed && (
                        <span className="font-medium">
                            {locale === 'ar' ? 'English' : 'العربية'}
                        </span>
                    )}

                    {/* Tooltip يظهر لما القائمة تكون مقفولة */}
                    {isCollapsed && (
                        <div className={`
                            absolute bg-gray-900 text-white text-xs px-2 py-1 rounded 
                            opacity-0 hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50
                            ltr:left-16 rtl:right-16
                        `}>
                            {locale === 'ar' ? 'Switch to English' : 'تغيير للعربية'}
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}

// مكون فرعي لعنصر القائمة (Reusable Nav Item)
function SidebarItem({ href, icon, text, active, collapsed }: any) {
    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group relative
                /* تغيير الألوان حسب النشاط */
                ${active
                    ? 'bg-white/20 text-white font-bold shadow-sm'
                    : 'text-matin-secondary hover:bg-white/10 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            {/* الأيقونة ثابتة الحجم */}
            <span className="shrink-0">{icon}</span>

            {/* النص يظهر ويختفي بتأثير ناعم */}
            {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden animate-fade-in">
                    {text}
                </span>
            )}

            {/* Tooltip عند الوقوف بالماوس والقائمة مقفولة */}
            {collapsed && (
                <div className={`
                  absolute bg-gray-900 text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none shadow-md
                  ltr:left-14 rtl:right-14
                `}>
                    {text}
                </div>
            )}
        </Link>
    );
}