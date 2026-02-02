"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OrderSummaryRow } from "@/components/marketplace/order-summary-row" // الكومبوننت اللي عملناه قبل كدا
import { Loader2, CreditCard, ShieldCheck } from "lucide-react"

interface BookingSummaryProps {
    dailyRate: number
    daysCount: number
    isSubmitting: boolean
}

export function BookingSummary({ dailyRate, daysCount, isSubmitting }: BookingSummaryProps) {

    // الحسابات (Logic خفيف جوا العرض)
    const subTotal = daysCount * dailyRate
    const tax = subTotal * 0.15
    const grandTotal = subTotal + tax

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'SAR', maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-6">ملخص الطلب</h3>

            <div className="space-y-4">
                <OrderSummaryRow label="سعر اليوم" value={formatCurrency(dailyRate)} />
                <OrderSummaryRow label="المدة" value={`${daysCount} أيام`} />
                <OrderSummaryRow label="المجموع الفرعي" value={formatCurrency(subTotal)} isTotal />
                <OrderSummaryRow label="الضريبة (15%)" value={formatCurrency(tax)} />
                <OrderSummaryRow label="الإجمالي" value={formatCurrency(grandTotal)} isBold isTotal />
            </div>

            {/*
          form="booking-form-id" 
          this is the most important line that links 
          the button to the form even if the form is in another component
      */}
            <Button
                type="submit"
                form="booking-form-id"
                className="w-full mt-8"
                size="lg"
                disabled={daysCount === 0 || isSubmitting}
            >
                {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري المعالجة...</>
                ) : (
                    <><CreditCard className="mr-2 h-4 w-4" /> تأكيد ودفع</>
                )}
            </Button>

            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>دفع آمن ومشفر 100%</span>
            </div>
        </Card>
    )
}