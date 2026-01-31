import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FooterComponent } from "@/components/layout/footer";
export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white w-full">
            {/* Public Navbar */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-matin-primary">
                        مَتين<span className="text-matin-action">.</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="/search" className="hover:text-matin-primary">تصفح المعدات</Link>
                        <Link href="/about" className="hover:text-matin-primary">عن المنصة</Link>
                        <Link href="/contact" className="hover:text-matin-primary">اتصل بنا</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost">تسجيل الدخول</Button>
                        </Link>
                        <Link href="/register">
                            <Button>حساب جديد</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Simple Footer */}
            <FooterComponent links={[
                {
                    title: "من نحن",
                    href: "/about"
                },
                {
                    title: "اتصل بنا",
                    href: "/contact"
                },
                {
                    title: "سياسة الخصوصية",
                    href: "/privacy"
                },
                {
                    title: "شروط الاستخدام",
                    href: "/terms"
                }
            ]} />
        </div>
    );
}