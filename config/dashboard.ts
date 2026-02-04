import {
    LayoutDashboard,
    Truck,
    FileText,
    Settings,
    Wallet,
    ShoppingCart,
    HardHat,
    ShieldCheck,
    Users,
    BarChart3
} from "lucide-react"

// Define the shape of a navigation item
export type NavItem = {
    title: string
    href: string
    icon: any
    color?: string
}

// The "Smart" Configuration Object
export const dashboardConfig = {
    // 1. Vendor Links (المؤجر)
    vendor: [
        { title: "overview", href: "/dashboard", icon: LayoutDashboard, color: "text-sky-500" },
        { title: "fleet", href: "/dashboard/fleet", icon: Truck, color: "text-violet-500" },
        { title: "vendorOrders", href: "/dashboard/vendor-orders", icon: FileText, color: "text-pink-700" },
        { title: "wallet", href: "/dashboard/wallet", icon: Wallet, color: "text-orange-700" },
    ],

    // 2. Tenant Links (المستأجر)
    tenant: [
        { title: "overview", href: "/dashboard", icon: LayoutDashboard, color: "text-sky-500" },
        { title: "projects", href: "/dashboard/projects", icon: HardHat, color: "text-emerald-500" },
        { title: "myOrders", href: "/dashboard/my-orders", icon: ShoppingCart, color: "text-violet-500" },
        { title: "invoices", href: "/dashboard/invoices", icon: FileText, color: "text-pink-700" },
    ],

    // 3. Super Admin Links (الوحش 🦁) - هنضيفه بسهولة هنا
    admin: [
        { title: "overview", href: "/dashboard/admin", icon: BarChart3, color: "text-indigo-500" },
        { title: "users_management", href: "/dashboard/admin/users", icon: Users, color: "text-blue-500" },
        { title: "disputes", href: "/dashboard/admin/disputes", icon: ShieldCheck, color: "text-red-500" },
        { title: "platform_settings", href: "/dashboard/admin/settings", icon: Settings, color: "text-gray-500" },
    ]
}