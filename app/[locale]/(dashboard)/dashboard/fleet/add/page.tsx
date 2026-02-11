"use client"

import { AddEquipmentWizard } from "@/components/dashboard/fleet/add-equipment-wizard"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddEquipmentPage() {
    const t = useTranslations("dashboard.equipment")

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/fleet">
                    <Button variant="ghost" size="icon" className="group">
                        <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-matin-primary transition-colors rtl:rotate-180" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("wizard.title")}</h1>
                    <p className="text-sm text-gray-500">{t("wizard.subtitle")}</p>
                </div>
            </div>

            <AddEquipmentWizard />
        </div>
    )
}
