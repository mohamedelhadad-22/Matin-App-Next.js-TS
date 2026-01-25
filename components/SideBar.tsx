'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import {
    LayoutDashboard,
    Tractor,
    ChevronLeft,
    ChevronRight,
    Languages
} from 'lucide-react';

export default function Sidebar() {
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    // Sidebar collapse state
    const [isCollapsed, setIsCollapsed] = useState(false);

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
        ${isCollapsed ? 'w-20' : 'w-64'} 
      `}
        /* Using Logical Property 'border-e' (Border End) 
           - In LTR (English): Puts border on Right side
           - In RTL (Arabic): Puts border on Left side
         */
        >

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`
          absolute top-9 bg-matin-action text-white p-1 rounded-full shadow-lg 
          hover:bg-orange-600 transition z-50
          
          /* Position Logic: Puts button on the "content-facing" edge */
          ltr:-right-3 
          rtl:-left-3
          
          /* Icon Rotation: Flips the arrow direction for RTL automatically */
          rtl:rotate-180
        `}
                aria-label="Toggle Sidebar"
            >
                {/* Logic: If collapsed, show Right arrow (to expand). Else Left.
            The 'rtl:rotate-180' class above handles the RTL mirroring. */}
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Brand Section */}
            <div className={`flex items-center gap-3 p-6 mb-4 h-20 ${isCollapsed ? 'justify-center' : ''}`}>

                {/* Collapsed Logo */}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-matin-action font-bold shrink-0 animate-fade-in">
                        {locale === 'ar' ? 'م' : 'M'}
                    </div>
                )}

                {/* Expanded Logo */}
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap animate-fade-in">
                        <h1 className="text-2xl font-bold text-white">
                            {locale === 'ar' ? 'مَتين' : 'Matin'} <span className="text-matin-action">.</span>
                        </h1>
                        <p className="text-[10px] text-matin-secondary opacity-80">
                            {t('subtitle')}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col gap-2 px-3 flex-1">
                <SidebarItem
                    href="/dashboard"
                    icon={<LayoutDashboard size={20} />}
                    text={t('dashboard')}
                    active={isActive('/dashboard')}
                    collapsed={isCollapsed}
                />

                <SidebarItem
                    href="/equipment"
                    icon={<Tractor size={20} />}
                    text={t('equipment')}
                    active={isActive('/equipment')}
                    collapsed={isCollapsed}
                />
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

                    {/* Tooltip */}
                    {isCollapsed && (
                        <div className={`
              absolute bg-gray-900 text-white text-xs px-2 py-1 rounded 
              opacity-0 hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50
              /* Tooltip Position Logic */
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

// Reusable Nav Item
function SidebarItem({ href, icon, text, active, collapsed }: any) {
    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group relative
        ${active ? 'bg-white/20 text-white font-bold' : 'text-matin-secondary hover:bg-white/10 hover:text-white'}
        ${collapsed ? 'justify-center' : ''}
      `}
        >
            <span className="shrink-0">{icon}</span>

            {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden animate-fade-in">
                    {text}
                </span>
            )}

            {/* Hover Tooltip */}
            {collapsed && (
                <div className={`
          absolute bg-gray-900 text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none shadow-md
          /* Tooltip Position Logic based on Direction */
          ltr:left-14 rtl:right-14
        `}>
                    {text}
                </div>
            )}
        </Link>
    );
}