import StatCard from "@/components/dashboard/StatCard";
import { getTranslations } from 'next-intl/server'; // 1. Server-side translation function

export default async function DashboardPage() {
    // 2. Await the translations (Async operation on server)
    const t = await getTranslations('Stats');
    const tGlobal = await getTranslations('Sidebar'); // Just to get generic titles if needed

    return (
        <div className="w-full">
            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">{tGlobal('dashboard')}</h1>
                <p className="text-gray-500">Welcome to Matin Dashboard</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={t('totalEquipment')} // 3. Using the key from JSON
                    value="142"
                    icon="🚜"
                    trend="+12"
                />
                <StatCard
                    title={t('activeRentals')}
                    value="28"
                    icon="📄"
                    trend="+5%"
                />
                <StatCard
                    title={t('maintenance')}
                    value="4"
                    icon="🔧"
                />
            </div>
        </div>
    );
}