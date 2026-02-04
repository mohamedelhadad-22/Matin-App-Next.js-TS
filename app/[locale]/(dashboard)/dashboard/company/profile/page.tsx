"use client"

import { BasicInfoCard } from "@/components/dashboard/company/basic-info-card"
import { DocumentCard } from "@/components/dashboard/company/document-card"
import { Badge } from "@/components/ui/badge"
import { useCompany } from "@/components/providers/company-context"

export default function CompanyProfilePage() {
    const { status } = useCompany()

    return (
        <div className="space-y-8 max-w-5xl mx-auto">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">ملف الشركة</h2>
                    <p className="text-muted-foreground mt-1">إدارة البيانات الرسمية والمستندات القانونية.</p>
                </div>

                {/* Global Status Badge */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
                    <span className="text-sm font-medium text-gray-500 px-2">حالة الحساب:</span>
                    <Badge variant={status === 'VERIFIED' ? 'success' : 'warning'} className="text-sm px-3 py-1">
                        {status === 'VERIFIED' ? 'موثق بالكامل ✅' : 'يحتاج مراجعة ⚠️'}
                    </Badge>
                </div>
            </div>

            {/* 2. Basic Info Section */}
            <BasicInfoCard />

            {/* 3. Documents Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    📂 المستندات القانونية
                    <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">3 مستندات مطلوبة</span>
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DocumentCard
                        title="السجل التجاري"
                        status="VERIFIED"
                        expiryDate="2027-05-20"
                    />
                    <DocumentCard
                        title="شهادة ضريبة القيمة المضافة"
                        status="PENDING"
                    />
                    <DocumentCard
                        title="خطاب الآيبان البنكي"
                        status="MISSING"
                    />
                </div>
            </div>

        </div>
    )
}