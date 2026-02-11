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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    pagination: PaginationState
    onPaginationChange: (pagination: PaginationState) => void
    onSearchChange: (value: string) => void
    onRoleFilterChange: (value: string) => void
    loading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
    onSearchChange,
    onRoleFilterChange,
    loading = false,
}: DataTableProps<TData, TValue>) {

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
            <div className="flex items-center gap-4">
                <Input
                    placeholder="بحث بالاسم أو البريد..."
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="max-w-sm"
                />
                <Select onValueChange={onRoleFilterChange} defaultValue="ALL">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="تصفية حسب الدور" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">الكل</SelectItem>
                        <SelectItem value="COMPANY">شركة</SelectItem>
                        <SelectItem value="INDIVIDUAL">فرد</SelectItem>
                        <SelectItem value="ADMIN">مسؤول</SelectItem>
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
                                    {loading ? 'جاري التحميل...' : 'لا توجد نتائج.'}
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
                    السابق
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    التالي
                </Button>
            </div>
        </div>
    )
}
