"use client"

import { Link } from "@/i18n/routing"
import { AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react"
import { useCompany } from "@/components/providers/company-context"
import { useLocale } from "next-intl"

export default function VerificationBanner() {
    const { status, isRestricted } = useCompany()
    const locale = useLocale()
    const isRtl = locale === 'ar'

    if (status === 'VERIFIED') return null

    return (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 shadow-sm relative z-40">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">

                <div className="flex items-center gap-2 text-orange-800 animate-pulse-slow">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-orange-600" />
                    <p>
                        <span className="font-bold">الحساب قيد المراجعة.</span> يرجى استكمال الملف التعريفي ورفع المستندات القانونية لتفعيل كافة المميزات.
                    </p>
                </div>

                <Link
                    href="/dashboard/company/profile"
                    className="whitespace-nowrap font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1 group"
                >
                    استكمال البيانات
                    {isRtl ? (
                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    )}
                </Link>
            </div>
        </div>
    )
}