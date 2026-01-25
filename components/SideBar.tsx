'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function Sidebar() {
    const t = useTranslations('Sidebar');
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-matin-primary text-white h-screen p-6 hidden md:flex flex-col border-l-4 border-matin-action">

            {/* Brand Logo */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">
                    مَتين <span className="text-matin-action">.</span>
                </h1>
                <p className="text-xs text-matin-secondary mt-1 opacity-80">
                    {t('subtitle')}
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">

                {/* Dashboard Link */}
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
            ${isActive('/dashboard')
                            ? 'bg-white/20 text-white font-bold'
                            : 'text-matin-secondary hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span>📊</span>
                    <span className="font-medium">{t('dashboard')}</span>
                </Link>

                {/* Equipment Link */}
                <Link
                    href="/equipment"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
            ${isActive('/equipment')
                            ? 'bg-white/20 text-white font-bold'
                            : 'text-matin-secondary hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span>🚜</span>
                    <span className="font-medium">{t('equipment')}</span>
                </Link>

            </nav>
        </aside>
    );
}