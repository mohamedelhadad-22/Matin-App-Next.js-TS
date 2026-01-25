"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
// 1. Define the shape of our data
export type Equipment = {
    id: string
    name: string
    status: "available" | "rented" | "maintenance"
    dailyRate: number
    category: string
}

// 2. Define columns structure
export const columns: ColumnDef<Equipment>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-2 hover:text-matin-primary transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Equipment Name
                    <ArrowUpDown className="h-4 w-4" />
                </button>
            )
        },
        cell: ({ row }) => <div className="font-bold text-gray-800">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            // const status = row.getValue("status") as string
            const status = row.getValue("status") as Equipment["status"]
            return (
                <Badge variant={status}>{status}</Badge>
            )
        },
    },
    {
        accessorKey: "dailyRate",
        header: () => <div className="text-right">Daily Rate</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("dailyRate"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "SAR",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
]