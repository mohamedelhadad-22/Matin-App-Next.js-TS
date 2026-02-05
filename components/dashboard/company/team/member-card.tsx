"use client"

import { MoreHorizontal, Shield, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamMemberProps {
    name: string
    email: string
    role: string
    status: string
    avatarUrl?: string
}

export function MemberCard({ name, email, role, status, avatarUrl }: TeamMemberProps) {

    // function to define the badge color according to the role
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return <Badge variant="default">مسؤول نظام</Badge>
            case 'ENGINEER': return <Badge variant="secondary">مهندس موقع</Badge>
            case 'ACCOUNTANT': return <Badge variant="outline">محاسب</Badge>
            default: return <Badge variant="outline">{role}</Badge>
        }
    }

    return (
        <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-t-4 border-t-transparent hover:border-t-matin-primary">

            {/* 1. Status Indicator */}
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-white ${status === 'ACTIVE' ? 'bg-green-500' :
                status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                }`} title={status} />

            {/* 2. Actions Menu */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                        <DropdownMenuItem>تعديل الصلاحيات</DropdownMenuItem>
                        <DropdownMenuItem>إيقاف الحساب</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">حذف الموظف</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 3. Avatar Section */}
            <Avatar className="w-20 h-20 mb-4 border-4 border-gray-50 shadow-sm group-hover:scale-105 transition-transform">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xl font-bold bg-matin-primary/10 text-matin-primary">
                    {name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            {/* 4. Info Section */}
            <h3 className="font-bold text-gray-900 text-lg truncate w-full">{name}</h3>
            <div className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" /> {email}
            </div>

            {/* 5. Role Badge */}
            <div className="mt-auto">
                {getRoleBadge(role)}
            </div>

        </Card>
    )
}