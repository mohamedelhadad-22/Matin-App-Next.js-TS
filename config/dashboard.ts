import {
    LayoutDashboard,
    Truck,
    FileText,
    Settings,
    Wallet,
    ShoppingCart,
    HardHat,
    Users,
    Building2,
    Gavel,
    PlusCircle
} from "lucide-react"
import { User } from "@/types/auth"

// Define the shape of a navigation item
export type NavItem = {
    title: string
    href: string
    icon: any
    color?: string
    /** If set, this item is only visible for specific entity types */
    visibleFor?: ('COMPANY' | 'INDIVIDUAL')[]
}

// The "Smart" Configuration Object
export const dashboardConfig = {
    // 1. Vendor Links
    vendor: [
        { title: "overview", href: "/dashboard", icon: LayoutDashboard, color: "text-sky-500" },
        { title: "fleet", href: "/dashboard/fleet", icon: Truck, color: "text-violet-500" },
        { title: "addEquipment", href: "/dashboard/fleet/add", icon: PlusCircle, color: "text-emerald-500", visibleFor: ['COMPANY'] as ('COMPANY' | 'INDIVIDUAL')[] },
        { title: "orders", href: "/dashboard/orders", icon: FileText, color: "text-pink-700" },
        { title: "wallet", href: "/dashboard/wallet", icon: Wallet, color: "text-orange-700" },
        { title: "team", href: "/dashboard/company/team", icon: Users, color: "text-blue-600" },
        { title: "trust_center", href: "/dashboard/company/trust", icon: Gavel, color: "text-yellow-600" },
    ],
    // 2. Tenant Links
    tenant: [
        { title: "overview", href: "/dashboard", icon: LayoutDashboard, color: "text-sky-500" },
        { title: "projects", href: "/dashboard/projects", icon: HardHat, color: "text-emerald-500" },
        { title: "myOrders", href: "/dashboard/my-orders", icon: ShoppingCart, color: "text-violet-500" },
        { title: "invoices", href: "/dashboard/invoices", icon: FileText, color: "text-pink-700" },
    ],

    // 3. Super Admin Links
    admin: [
        { title: "overview", href: "/admin", icon: LayoutDashboard },
        { title: "users_management", href: "/admin/users", icon: Users },
        { title: "companies", href: "/admin/companies", icon: Building2 },
        { title: "disputes", href: "/admin/disputes", icon: Gavel },
        { title: "platform_settings", href: "/admin/settings", icon: Settings },
    ]

}

export function getNavItems(user: User | null): NavItem[] {
    if (!user) return []

    let items: NavItem[] = []

    // 1. لو أدمن -> رجع قائمة الأدمن
    if (user.user_role === 'ADMIN') {
        items = dashboardConfig.admin
    }
    // 2. لو شركة -> رجع قائمة الفيندور
    else if (user.entity_type === 'COMPANY') {
        items = dashboardConfig.vendor
    }
    // 3. غير كدة (فرد) -> رجع قائمة التينانت
    else {
        items = dashboardConfig.tenant
    }

    // Filter by visibleFor if set
    return items.filter(item => {
        if (!item.visibleFor) return true
        return item.visibleFor.includes(user.entity_type)
    })
}