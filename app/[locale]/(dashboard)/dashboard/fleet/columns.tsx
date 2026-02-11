"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Equipment } from "@/types/equipment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

type TFunction = (key: string, params?: any) => string

interface ColumnHandlers {
    onEdit: (equipment: Equipment) => void
    onDelete: (equipment: Equipment) => void
    onView: (equipment: Equipment) => void
}

export const getColumns = (t: TFunction, handlers: ColumnHandlers): ColumnDef<Equipment>[] => [
    {
        accessorKey: "primary_image_url",
        header: t("fields.image"),
        cell: ({ row }) => {
            const url = row.getValue("primary_image_url") as string
            return (
                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 border">
                    {url ? (
                        <Image
                            src={url}
                            alt={row.original.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Img</div>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: t("fields.name"),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "brand",
        header: t("fields.brand"),
        cell: ({ row }) => <div>{row.getValue("brand")} / {row.original.model}</div>,
    },
    {
        accessorKey: "category",
        header: t("fields.category"),
        cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
        accessorKey: "status",
        header: t("fields.status"),
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline"

            switch (status) {
                case 'AVAILABLE': variant = "default"; break;
                case 'RENTED': variant = "secondary"; break;
                case 'MAINTENANCE': variant = "destructive"; break;
                default: variant = "outline";
            }

            return (
                <Badge variant={variant}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "price_daily",
        header: t("fields.dailyPrice"),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price_daily"))
            const formatted = new Intl.NumberFormat("en-SA", {
                style: "currency",
                currency: "SAR",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        id: "actions",
        header: t("fields.actions"),
        cell: ({ row }) => {
            const equipment = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("fields.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlers.onView(equipment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("actions.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlers.onEdit(equipment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlers.onDelete(equipment)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("actions.delete")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
