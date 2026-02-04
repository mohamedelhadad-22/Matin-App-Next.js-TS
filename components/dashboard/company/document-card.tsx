"use client"

import { FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// defining the possible states of the document
type DocStatus = 'MISSING' | 'PENDING' | 'VERIFIED' | 'REJECTED'

interface DocumentCardProps {
    title: string
    status: DocStatus
    expiryDate?: string
}

export function DocumentCard({ title, status, expiryDate }: DocumentCardProps) {

    // a function that returns the appropriate badge according to the state (Logic Extraction)
    const getStatusBadge = () => {
        switch (status) {
            case 'VERIFIED':
                return <Badge variant="success">تم التوثيق</Badge>
            case 'PENDING':
                return <Badge variant="warning">قيد المراجعة</Badge>
            case 'REJECTED':
                return <Badge variant="destructive">مرفوض</Badge>
            default:
                return <Badge variant="secondary">مطلوب</Badge>
        }
    }

    return (
        <Card className="p-4 flex flex-col gap-4 hover:shadow-md transition-shadow border-dashed border-2">
            <div className="flex justify-between items-start">
                {/* Icon Area */}
                <div className="p-3 bg-gray-50 rounded-lg">
                    {status === 'VERIFIED' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                        <FileText className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                {getStatusBadge()}
            </div>

            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {expiryDate && (
                    <p className="text-xs text-gray-500 mt-1">ينتهي في: {expiryDate}</p>
                )}
                {status === 'MISSING' && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> يرجى الرفع
                    </p>
                )}
            </div>

            <div className="mt-auto pt-2">
                {status === 'MISSING' || status === 'REJECTED' ? (
                    <Button size="sm" variant="outline" className="w-full gap-2 border-dashed">
                        <Upload className="w-4 h-4" /> رفع الملف
                    </Button>
                ) : (
                    <Button size="sm" variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                        عرض الملف
                    </Button>
                )}
            </div>
        </Card>
    )
}