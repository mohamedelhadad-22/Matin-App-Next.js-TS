"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AdminUser } from "@/types/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Ban, CheckCircle, Eye } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { adminService } from "@/services/admin"
import { toast } from "sonner"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = AdminUser

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="w-[80px] truncate" title={row.getValue("id")}>{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: "الاسم",
    },
    {
        accessorKey: "email",
        header: "البريد الإلكتروني",
    },
    {
        accessorKey: "role",
        header: "الدور",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant={role === 'ADMIN' ? 'destructive' : 'secondary'}>
                    {role}
                </Badge>
            )
        },
    },
    {
        accessorKey: "entityType",
        header: "نوع الكيان",
        cell: ({ row }) => {
            const type = row.getValue("entityType") as string
            return (
                <Badge variant="outline">
                    {type === 'COMPANY' ? 'شركة' : 'فرد'}
                </Badge>
            )
        },
    },
    {
        accessorKey: "verificationStatus",
        header: "حالة التحقق",
        cell: ({ row }) => {
            const status = row.getValue("verificationStatus") as string
            let variant: "default" | "secondary" | "destructive" | "outline" = "default"

            switch (status) {
                case 'VERIFIED': variant = "default"; break; // we might want green
                case 'PENDING': variant = "secondary"; break; // we might want orange
                case 'REJECTED': variant = "destructive"; break;
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
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            const handleVerify = async () => {
                try {
                    await adminService.verifyUser(user.id);
                    toast.success("تم تفعيل المستخدم بنجاح");
                    window.location.reload(); // Simple reload to refresh data
                } catch (error) {
                    toast.error("حدث خطأ أثناء التفعيل");
                }
            }

            const handleBan = async () => {
                try {
                    await adminService.banUser(user.id);
                    toast.success("تم حظر المستخدم بنجاح");
                    window.location.reload();
                } catch (error) {
                    toast.error("حدث خطأ أثناء الحظر");
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                            نسخ المعرف
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Eye className="ml-2 h-4 w-4" />
                            عرض التفاصيل
                        </DropdownMenuItem>
                        {user.verificationStatus === 'PENDING' && (
                            <DropdownMenuItem onClick={handleVerify}>
                                <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                                تفعيل التحقق
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleBan} className="text-red-600">
                            <Ban className="ml-2 h-4 w-4" />
                            حظر المستخدم
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
