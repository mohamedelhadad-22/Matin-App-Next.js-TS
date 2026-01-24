import Link from 'next/link';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-matin-primary text-white h-screen p-6 hidden md:flex flex-col border-l-4 border-ratal-action">

            {/* Brand Logo */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">
                    مَتين <span className="text-ratal-action">.</span>
                </h1>
                <p className="text-xs text-ratal-secondary mt-1 opacity-80">معدات يُعتمد عليها</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-ratal-secondary hover:text-white"
                >
                    <span>📊</span>
                    <span className="font-medium">لوحة التحكم</span>
                </Link>

                <Link
                    href="/equipment"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-ratal-secondary hover:text-white"
                >
                    <span>🚜</span>
                    <span className="font-medium">المعدات</span>
                </Link>
            </nav>
        </aside>
    );
}