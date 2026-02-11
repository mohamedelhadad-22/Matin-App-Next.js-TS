"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useRouter } from "next/navigation"
import { Plus, Truck, Search } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { equipmentService } from "@/services/equipment"
import { Equipment } from "@/types/equipment"
import { FleetDataTable } from "./data-table"
import { getColumns } from "./columns"

export default function FleetPage() {
    const t = useTranslations("dashboard.equipment")
    const router = useRouter()
    const [data, setData] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    // ── Fetch Data ──────────────────────────────────────────────
    const fetchFleet = async () => {
        setLoading(true)
        try {
            const response = await equipmentService.getMyFleet()
            setData(Array.isArray(response) ? response : [])
        } catch (error) {
            console.error("Failed to fetch fleet", error)
            toast.error(t("failedToLoad"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFleet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Action Handlers ─────────────────────────────────────────
    const handleEdit = (equipment: Equipment) => {
        router.push(`/dashboard/fleet/edit/${equipment.id}`)
    }

    const handleView = (equipment: Equipment) => {
        router.push(`/dashboard/equipment/${equipment.id}`)
    }

    const handleDeleteClick = (equipment: Equipment) => {
        setDeleteId(equipment.id)
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        try {
            await equipmentService.delete(deleteId)
            toast.success(t("actions.deleteSuccess"))
            fetchFleet()
        } catch (error) {
            console.error("Failed to delete", error)
            toast.error(t("actions.deleteFailed"))
        } finally {
            setDeleteId(null)
        }
    }

    // ── Columns ─────────────────────────────────────────────────
    const columns = getColumns((key, params) => t(key as any, params), {
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        onView: handleView,
    })

    // ── Filtered Data ───────────────────────────────────────────
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // ── Empty State ─────────────────────────────────────────────
    const EmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
        >
            <div className="relative mb-8">
                {/* Animated Background Circles */}
                <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-matin-primary/10 to-blue-500/10 blur-2xl animate-pulse" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-matin-primary/20 to-blue-500/20 flex items-center justify-center border border-matin-primary/10">
                    <Truck className="w-16 h-16 text-matin-primary/60" strokeWidth={1.5} />
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{t("emptyState.title")}</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">{t("emptyState.description")}</p>

            <Button asChild className="bg-matin-primary hover:bg-matin-primary/90 text-white px-8 py-3 rounded-xl shadow-lg shadow-matin-primary/25 transition-all hover:shadow-xl hover:shadow-matin-primary/30 hover:-translate-y-0.5">
                <Link href="/dashboard/fleet/add">
                    <Plus className="me-2 h-5 w-5" />
                    {t("emptyState.addFirst")}
                </Link>
            </Button>
        </motion.div>
    )

    // ── Loading Skeleton ────────────────────────────────────────
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <div className="flex gap-4 mb-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
            {/* ── Page Header ──────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t("title")}</h2>
                    <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
                </div>
                <Button asChild className="bg-matin-primary hover:bg-matin-primary/90 text-white rounded-xl shadow-md shadow-matin-primary/20 transition-all hover:shadow-lg hover:shadow-matin-primary/30">
                    <Link href="/dashboard/fleet/add">
                        <Plus className="me-2 h-4 w-4" />
                        {t("addButton")}
                    </Link>
                </Button>
            </div>

            {/* ── Content ──────────────────────────────────────── */}
            {loading ? (
                <LoadingSkeleton />
            ) : data.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={t("searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ps-9 rounded-xl border-gray-200 focus:ring-matin-primary/30"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <FleetDataTable
                        data={filteredData}
                        columns={columns}
                    />
                </div>
            )}

            {/* ── Delete Confirmation Dialog ───────────────────── */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("actions.deleteTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("actions.deleteDesc")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">{t("actions.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 rounded-xl">
                            {t("actions.confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
