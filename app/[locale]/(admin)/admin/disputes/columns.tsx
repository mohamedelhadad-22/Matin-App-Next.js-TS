"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AdminDispute } from "@/types/admin"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ExternalLink, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useParams } from "next/navigation"

export const getColumns = (
    t: any,
    locale: string,
    onResolve: (dispute: AdminDispute) => void
): ColumnDef<AdminDispute>[] => [
        {
            accessorKey: "id",
            header: t("table.id"),
            cell: ({ row }) => {
                return (
                    <Link
                        href={`/${locale}/admin/disputes/${row.original.id}`}
                        className="font-medium text-primary hover:underline"
                    >
                        #{row.original.id.substring(0, 8)}
                    </Link>
                )
            },
        },
        {
            accessorKey: "orderId",
            header: t("table.orderId"),
            cell: ({ row }) => {
                return (
                    <Link
                        href={`/${locale}/admin/orders/${row.original.orderId}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                        #{row.original.orderId.substring(0, 8)}
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                )
            },
        },
        {
            accessorKey: "complainantName",
            header: t("table.complainant"),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.complainantName}</span>
                    <span className="text-xs text-muted-foreground">ID: {row.original.complainantId.substring(0, 8)}</span>
                </div>
            ),
        },
        {
            accessorKey: "respondentName",
            header: t("table.respondent"),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.respondentName}</span>
                    <span className="text-xs text-muted-foreground">ID: {row.original.respondentId.substring(0, 8)}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: t("table.status"),
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        variant={
                            status === "RESOLVED"
                                ? "success"
                                : status === "OPEN"
                                    ? "warning"
                                    : "destructive"
                        }
                    >
                        {t(`status.${status}`)}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: t("table.date"),
            cell: ({ row }) => {
                return new Date(row.original.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-SA" : "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const dispute = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/${locale}/admin/disputes/${dispute.id}`} className="flex items-center">
                                    <ExternalLink className="me-2 h-4 w-4" />
                                    {t("actions.viewDetails")}
                                </Link>
                            </DropdownMenuItem>
                            {dispute.status !== "RESOLVED" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onResolve(dispute)} className="text-primary">
                                        <Scale className="me-2 h-4 w-4" />
                                        {t("actions.resolve")}
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
