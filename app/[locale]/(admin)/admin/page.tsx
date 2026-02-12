'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { AdminStats } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, AlertCircle, TrendingUp, Activity } from 'lucide-react'; // Added Activity icon
import { Skeleton } from '@/components/ui/skeleton';
import { WelcomeHeader } from '@/components/shared/welcome-header';
import { OverviewChart } from '@/components/dashboard/admin/overview-chart';
import { useTranslations } from 'next-intl';

// 1. تعريف بيانات احتياطية (عشان الصفحة ما تموتش لو السيرفر واقع)
const FALLBACK_STATS: AdminStats = {
    totalUsers: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
    revenue: 0,
    newRegistrations: [] // مصفوفة فارغة للتشارت
};

export default function AdminDashboardPage() {
    // نبدأ بالبيانات الاحتياطية فوراً عشان ميكونش فيه null أبداً
    const [stats, setStats] = useState<AdminStats>(FALLBACK_STATS);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false); // لمعرفة هل نعتمد على الحقيقي أم الاحتياطي
    const t = useTranslations('dashboard.overview.admin');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // محاولة جلب الداتا الحقيقية
                const data = await adminService.getStats();
                if (data) {
                    setStats(data);
                } else {
                    throw new Error("No data returned");
                }
            } catch (error) {
                console.warn('⚠️ Admin Stats API Failed (Using Fallback):', error);
                setApiError(true);
                // لن نفعل شيء هنا لأن stats قيمتها الابتدائية هي FALLBACK_STATS
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // عرض Skeleton أثناء التحميل
    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">

            {/* Header Section */}
            <WelcomeHeader />

            {/* تنبيه صغير لو الداتا مش حقيقية (للمطور فقط) */}
            {apiError && (
                <div className="bg-yellow-50 text-yellow-800 text-xs p-2 rounded-md border border-yellow-200 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>Backend connection failed. Displaying fallback UI (Zeros).</span>
                </div>
            )}

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t("stats.users")}
                    value={stats.totalUsers}
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    borderColor="border-blue-500"
                />

                <StatCard
                    title={t("stats.pending")}
                    value={stats.pendingVerifications}
                    icon={<Building2 className="h-6 w-6 text-orange-600" />}
                    borderColor="border-orange-500"
                />

                <StatCard
                    title={t("stats.disputes")}
                    value={stats.activeDisputes}
                    icon={<AlertCircle className="h-6 w-6 text-red-600" />}
                    borderColor="border-red-500"
                />

                <StatCard
                    title={t("stats.revenue")}
                    value={`${stats.revenue.toLocaleString()} SAR`}
                    icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                    borderColor="border-green-500"
                />
            </div>

            {/* Registration Trends Chart */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
                {/* نتأكد إن فيه داتا للتشارت، لو مفيش نعرض رسالة */}
                {stats.newRegistrations && stats.newRegistrations.length > 0 ? (
                    <OverviewChart data={stats.newRegistrations} />
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
                        No chart data available yet.
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Helper Components ---

function StatCard({
    title,
    value,
    icon,
    borderColor
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    borderColor: string
}) {
    return (
        <Card className={`border-l-4 ${borderColor} shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="p-2 bg-gray-50 rounded-full">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-6">
            <Skeleton className="h-32 w-full rounded-2xl bg-gray-100" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl bg-gray-100" />
                ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl bg-gray-100" />
        </div>
    );
}