'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { AdminStats } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, AlertCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!stats) {
        return <div className="p-6 text-center text-red-500">Failed to load dashboard data.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الإدارة 🛡️</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="إجمالي المستخدمين"
                    value={stats.totalUsers}
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    borderColor="border-blue-600"
                />
                <StatCard
                    title="طلبات التحقق المعلقة"
                    value={stats.pendingVerifications}
                    icon={<Building2 className="h-6 w-6 text-orange-600" />}
                    borderColor="border-orange-600"
                />
                <StatCard
                    title="النزاعات النشطة"
                    value={stats.activeDisputes}
                    icon={<AlertCircle className="h-6 w-6 text-red-600" />}
                    borderColor="border-red-600"
                />
                <StatCard
                    title="الإيرادات"
                    value={`${stats.revenue.toLocaleString()} ر.س`}
                    icon={<TrendingUp className="h-6 w-6 text-green-600" />}
                    borderColor="border-green-600"
                />
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>التسجيلات الجديدة خلال الوقت</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.newRegistrations}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" name="مستخدم جديد" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, borderColor }: { title: string; value: string | number; icon: React.ReactNode; borderColor: string }) {
    return (
        <Card className={`border-l-4 ${borderColor} shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    );
}
