"use client"

import { useTranslations } from "next-intl"

export default function DashboardPage() {
    const t = useTranslations("dashboard.sidebar") // هنجيب النصوص عشان نجرب

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{t("overview")}</h2>

            {/* Temporary Placeholder Content */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* هنسيب المكان ده للكروت (KPIs) اللي اتفقنا عليها في الخطة */}
                <div className="p-6 bg-white rounded-xl shadow-sm border">
                    <div className="text-sm font-medium text-muted-foreground">إجمالي الدخل</div>
                    <div className="text-2xl font-bold mt-2">SAR 45,231.89</div>
                </div>
            </div>
        </div>
    )
}