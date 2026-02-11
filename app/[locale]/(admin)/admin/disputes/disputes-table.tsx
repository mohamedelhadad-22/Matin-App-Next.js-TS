"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"

interface DisputesTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    onSearchChange: (value: string) => void
    onStatusFilterChange: (value: string) => void
    loading?: boolean
}

export function DisputesTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
    onSearchChange,
    onStatusFilterChange,
    loading = false,
}: DisputesTableProps<TData, TValue>) {
    const t = useTranslations("admin.disputes")

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                onPaginationChange(updater(pagination));
            } else {
                onPaginationChange(updater);
            }
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Input
                    placeholder={t("table.complainant") + "..."}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="max-w-sm"
                />
                <Select onValueChange={onStatusFilterChange} defaultValue="ALL">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("table.status")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">{t("status.OPEN")} / {t("status.RESOLVED")}</SelectItem>
                        <SelectItem value="OPEN">{t("status.OPEN")}</SelectItem>
                        <SelectItem value="RESOLVED">{t("status.RESOLVED")}</SelectItem>
                        <SelectItem value="ESCALATED">{t("status.ESCALATED")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {loading ? '...' : 'No results.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {t("actions.back") || "Back"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {t("actions.next") || "Next"}
                </Button>
            </div>
        </div>
    )
}
