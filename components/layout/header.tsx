"use client"

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function Header() {
    const t = useTranslations("MarketplaceLayout")
    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-matin-primary">
                    {t("logo")}
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href="/search" className="hover:text-matin-primary">{t("nav.search")}</Link>
                    <Link href="/about" className="hover:text-matin-primary">{t("nav.about")}</Link>
                    <Link href="/contact" className="hover:text-matin-primary">{t("nav.contact")}</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost">{t("actions.login")}</Button>
                    </Link>
                    <Link href="/register">
                        <Button>{t("actions.register")}</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
