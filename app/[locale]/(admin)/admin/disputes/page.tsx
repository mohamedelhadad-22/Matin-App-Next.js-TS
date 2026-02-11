"use client"

import { useEffect, useState, useMemo } from "react"
import { AdminDispute, DisputeDecision, DisputeStatus } from "@/types/admin"
import { getColumns } from "./columns"
import { DisputesTable } from "./disputes-table"
import { adminService } from "@/services/admin"
import { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function DisputesPage() {
    const t = useTranslations("admin.disputes")
    const { locale } = useParams()
    const [data, setData] = useState<AdminDispute[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [pageCount, setPageCount] = useState(0)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<DisputeStatus | "ALL">("ALL")

    // Resolve Dialog State
    const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null)
    const [isResolveOpen, setIsResolveOpen] = useState(false)
    const [decision, setDecision] = useState<DisputeDecision>("RELEASE_VENDOR")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchDisputes = async () => {
        setLoading(true)
        try {
            const response = await adminService.getDisputes({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search: search || undefined,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            })
            setData(response.data)
            setPageCount(response.totalPages)
        } catch (error) {
            toast.error("Failed to load disputes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDisputes()
    }, [pagination.pageIndex, pagination.pageSize, search, statusFilter])

    const handleResolveClick = (dispute: AdminDispute) => {
        setSelectedDispute(dispute)
        setIsResolveOpen(true)
    }

    const handleResolveSubmit = async () => {
        if (!selectedDispute) return

        setIsSubmitting(true)
        try {
            await adminService.resolveDispute(selectedDispute.id, decision)
            toast.success(t("resolveDialog.success"))
            setIsResolveOpen(false)
            fetchDisputes()
        } catch (error) {
            toast.error("Failed to resolve dispute")
        } finally {
            setIsSubmitting(false)
        }
    }

    const columns = useMemo(
        () => getColumns(t, locale as string, handleResolveClick),
        [t, locale]
    )

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                    <p className="text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <DisputesTable
                data={data}
                columns={columns}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                onSearchChange={setSearch}
                onStatusFilterChange={(val) => setStatusFilter(val as any)}
                loading={loading}
            />

            <Dialog open={isResolveOpen} onOpenChange={setIsResolveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("resolveDialog.title")}</DialogTitle>
                        <DialogDescription>
                            {t("resolveDialog.desc")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>{t("resolveDialog.decision")}</Label>
                            <Select
                                value={decision}
                                onValueChange={(val) => setDecision(val as DisputeDecision)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="RELEASE_VENDOR">{t("resolveDialog.releaseVendor")}</SelectItem>
                                    <SelectItem value="REFUND_TENANT">{t("resolveDialog.refundTenant")}</SelectItem>
                                    <SelectItem value="PARTIAL_REFUND">{t("resolveDialog.partialRefund")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResolveOpen(false)}>
                            {t("actions.cancel") || "Cancel"}
                        </Button>
                        <Button onClick={handleResolveSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "..." : t("resolveDialog.submit")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
