"use client"

import { useEffect, useState, useMemo } from "react"
import { AdminUser } from "@/types/admin"
import { columns } from "./columns" // Import basic columns
import { DataTable } from "./data-table"
import { adminService } from "@/services/admin"
import { PaginationState } from "@tanstack/react-table"
import { toast } from "sonner"

export default function UsersPage() {
    const [data, setData] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [pageCount, setPageCount] = useState(0)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("ALL")

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await adminService.getUsers({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search,
                role: role === "ALL" ? undefined : role,
            })
            setData(response.data)
            setPageCount(response.totalPages)
        } catch (error) {
            toast.error("فشل في جلب المستخدمين")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [pagination.pageIndex, pagination.pageSize, search, role])

    // If we want columns to refresh data without full reload, we need to pass a refresh function.
    // For now, the actions in columns.tsx use window.location.reload().
    // We can improve this later by using table meta or context.

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">إدارة المستخدمين</h2>
                    <p className="text-muted-foreground">
                        عرض وإدارة جميع المستخدمين في المنصة.
                    </p>
                </div>
            </div>
            <DataTable
                data={data}
                columns={columns}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                onSearchChange={setSearch}
                onRoleFilterChange={setRole}
                loading={loading}
            />
        </div>
    )
}
