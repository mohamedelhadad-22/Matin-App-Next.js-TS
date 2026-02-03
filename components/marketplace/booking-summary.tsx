"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OrderSummaryRow } from "@/components/marketplace/order-summary-row"
import { Loader2, Send, FileText } from "lucide-react"
import { useTranslations } from "next-intl"

interface BookingSummaryProps {
    dailyRate: number
    daysCount: number
    isSubmitting: boolean
}

export function BookingSummary({ dailyRate, daysCount, isSubmitting }: BookingSummaryProps) {
    const t = useTranslations("marketplace.equipment.book")
    const subTotal = daysCount * dailyRate

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'SAR', maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <Card className="p-6 sticky top-24 border-matin-primary/20 shadow-md">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-matin-primary" />
                {t("summaryEstimated")}
            </h3>

            <div className="space-y-4">
                <OrderSummaryRow label={t("dailyRateGuideline")} value={formatCurrency(dailyRate)} />
                <OrderSummaryRow label={t("durationRequired")} value={t("days", { count: daysCount })} />
                <div className="my-2 border-t border-dashed" />
                <OrderSummaryRow label={t("totalEstimate")} value={formatCurrency(subTotal)} isBold isTotal />

                <p className="text-xs text-muted-foreground mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                    {t("priceNote")}
                </p>
            </div>


            <Button
                type="submit"
                form="booking-form-id"
                className="w-full mt-8 bg-matin-primary hover:bg-matin-primary/90"
                size="lg"
                disabled={daysCount === 0 || isSubmitting}
            >
                {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sending")}</>
                ) : (

                    <><Send className="mr-2 h-4 w-4" /> {t("sendQuoteRequest")}</>
                )}
            </Button>

            <div className="mt-4 text-center text-xs text-gray-500">
                {t("noChargeWarning")}
            </div>
        </Card>
    )
}