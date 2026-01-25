"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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
            const status = row.getValue("status") as string

            // Status Badge Styling logic
            const colors = {
                available: "bg-green-100 text-green-700",
                rented: "bg-blue-100 text-blue-700",
                maintenance: "bg-red-100 text-red-700"
            }[status] || "bg-gray-100 text-gray-700"

            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors}`}>
                    {status}
                </span>
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