"use client"

import { MemberCard } from "@/components/dashboard/company/team/member-card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"

export default function TeamPage() {
    return (
        <div className="space-y-8">

            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="w-8 h-8 text-matin-primary" />
                        فريق العمل
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        أضف مهندسين ومشرفين لإدارة طلباتك ومعداتك.
                    </p>
                </div>

                <Button className="bg-matin-primary hover:bg-matin-primary/90 gap-2 shadow-lg shadow-matin-primary/20">
                    <Plus className="w-4 h-4" /> دعوة عضو جديد
                </Button>
            </div>

            {/* 2. Members Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {/* Mock Data (بيانات تجريبية) */}
                <MemberCard
                    name="محمد الحداد"
                    email="admin@matin.sa"
                    role="ADMIN"
                    status="ACTIVE"
                    avatarUrl="/avatars/01.png"
                />

                <MemberCard
                    name="أحمد المهندس"
                    email="eng.ahmed@matin.sa"
                    role="ENGINEER"
                    status="ACTIVE"
                />

                <MemberCard
                    name="سارة المحاسبة"
                    email="finance@matin.sa"
                    role="ACCOUNTANT"
                    status="PENDING"
                />

                {/* كارت "فاضي" كأنه دعوة (فكرة UX حلوة) */}
                <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-matin-primary/50 hover:bg-gray-50 transition-all group h-full min-h-[250px]">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-matin-primary" />
                    </div>
                    <span className="font-medium text-gray-500 group-hover:text-matin-primary">إضافة عضو جديد</span>
                </button>

            </div>
        </div>
    )
}