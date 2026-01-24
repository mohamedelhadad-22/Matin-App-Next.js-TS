import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
    return (
        <div>
            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">نظرة عامة</h1>
                <p className="text-gray-500">مرحباً بك في لوحة تحكم متين</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="إجمالي المعدات"
                    value="142"
                    icon="🚜"
                    trend="+12 هذا الشهر"
                />
                <StatCard
                    title="عقود التأجير النشطة"
                    value="28"
                    icon="📄"
                    trend="+5%"
                />
                <StatCard
                    title="الصيانة المطلوبة"
                    value="4"
                    icon="🔧"
                />
            </div>
        </div>
    );
}