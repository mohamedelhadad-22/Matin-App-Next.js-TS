"use client"

import { Link } from "@/i18n/routing"
import { AlertTriangle, XCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useTranslations, useLocale } from "next-intl"

export default function VerificationBanner() {
    const { user } = useAuth()
    const t = useTranslations("dashboard.verification")
    const locale = useLocale()
    const isRtl = locale === 'ar'

    // If no user or already verified, render nothing
    if (!user || user.user_role === 'ADMIN' || user.verification_status === 'VERIFIED') return null

    const isPending = user.verification_status === 'PENDING'
    const isRejected = user.verification_status === 'REJECTED'

    return (
        <div
            className={`
                border-b px-4 py-3 shadow-sm relative z-40 
                ${isPending ? 'bg-amber-50 border-amber-200' : ''}
                ${isRejected ? 'bg-red-50 border-red-200' : ''}
            `}
        >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">

                {/* Status Message */}
                <div className={`flex items-center gap-2 ${isPending ? 'text-amber-800' : 'text-red-800'}`}>
                    {isPending ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
                    ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <p>
                        <span className="font-bold">
                            {isPending ? t("pending_title") : t("rejected_title")}
                        </span>
                        {' '}
                        {isPending ? t("pending_desc") : t("rejected_desc")}
                    </p>
                </div>

                {/* Action Button */}
                {isPending && (
                    <Link
                        href="/dashboard/company/profile"
                        className={`
                            whitespace-nowrap font-medium text-amber-700 hover:text-amber-900 
                            hover:bg-amber-100 px-3 py-1 rounded-md transition-colors 
                            flex items-center gap-1 group
                        `}
                    >
                        {t("complete_profile")}
                        {isRtl ? (
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        ) : (
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        )}
                    </Link>
                )}

                {isRejected && (
                    <Link
                        href="/dashboard/company/profile"
                        className={`
                            whitespace-nowrap font-medium text-red-700 hover:text-red-900
                            hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors 
                            flex items-center gap-1.5 group border border-red-200
                        `}
                    >
                        <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
                        {t("resubmit")}
                    </Link>
                )}
            </div>
        </div>
    )
}