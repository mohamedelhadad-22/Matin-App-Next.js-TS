import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FooterComponent } from "@/components/layout/footer";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/header";
export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations("MarketplaceLayout")
    return (
        <div className="min-h-screen flex flex-col bg-white w-full">
            {/* Public Navbar */}
            <Header />
            {/* Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Simple Footer */}
            <FooterComponent links={[
                {
                    title: t("footer.about"),
                    href: "/about"
                },
                {
                    title: t("footer.contact"),
                    href: "/contact"
                },
                {
                    title: t("footer.privacy"),
                    href: "/privacy"
                },
                {
                    title: t("footer.terms"),
                    href: "/terms"
                }
            ]} />
        </div>
    );
}