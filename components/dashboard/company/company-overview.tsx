"use client"

import { useTranslations } from "next-intl"
import {
    TrendingUp,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    Users,
    Plus,
    ArrowRight
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// --- Mock Data ---
const financialData = {
    revenue: "450,000",
    outstanding: "12,500",
    creditLimit: 75, // percentage
    creditLimitValue: "750,000"
}

const fleetData = [
    { name: 'Available', value: 12, color: '#10b981' }, // green-500
    { name: 'Rented', value: 8, color: '#3b82f6' },    // blue-500
    { name: 'Maintenance', value: 3, color: '#f59e0b' }, // amber-500
]

const rfqList = [
    { id: 1, client: "Saudi Binladin Group", project: "Riyadh Metro", equipment: "CAT 320 Excavator", date: "2 hrs ago", status: "PENDING" },
    { id: 2, client: "Almabani", project: "Red Sea Project", equipment: "Komatsu Dozer", date: "5 hrs ago", status: "PENDING" },
    { id: 3, client: "Nesma & Partners", project: "Diriyah Gate", equipment: "Mobile Crane 50T", date: "1 day ago", status: "PENDING" },
]

const teamMembers = [
    { id: 1, name: "Ahmed Ali", role: "Manager", image: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Sara Smith", role: "Sales", image: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Khaled Omar", role: "Engineer", image: "https://i.pravatar.cc/150?u=3" },
]

export function CompanyDashboard() {
    const t = useTranslations("dashboard.overview.company")

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Financial Pulse (Top Row) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} className="text-matin-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.revenue")}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{financialData.revenue} <span className="text-sm font-normal text-gray-500">SAR</span></h3>
                        <div className="flex items-center mt-4 text-emerald-600 text-sm font-medium">
                            <TrendingUp size={16} className="mr-1" />
                            <span>+12.5% from last month</span>
                        </div>
                    </div>
                </div>

                {/* Outstanding Invoices */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle size={80} className="text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.outstanding")}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{financialData.outstanding} <span className="text-sm font-normal text-gray-500">SAR</span></h3>
                        <div className="flex items-center mt-4 text-amber-600 text-sm font-medium">
                            <Clock size={16} className="mr-1" />
                            <span>3 invoices pending</span>
                        </div>
                    </div>
                </div>

                {/* Credit Limit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={80} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.creditLimit")}</p>
                        <div className="flex items-end justify-between mb-2">
                            <h3 className="text-3xl font-bold text-gray-900">{financialData.creditLimit}%</h3>
                            <span className="text-sm text-gray-500 mb-1">{financialData.creditLimitValue} SAR used</span>
                        </div>
                        <Progress value={financialData.creditLimit} className="h-2 bg-gray-100" indicatorClassName="bg-matin-primary" />
                    </div>
                </div>
            </div>

            {/* 2. Middle Section: Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Fleet Status (Donut Chart) - Takes 1 column */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800">{t("fleet.title")}</h4>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8">View Report</Button>
                    </div>

                    <div className="h-48 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={fleetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {fleetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-900">23</span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {fleetData.map((item) => (
                            <div key={item.name} className="text-center">
                                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                                <p className="text-xs font-medium text-gray-500">{t(`fleet.${item.name.toLowerCase()}` as any)}</p>
                                <p className="text-lg font-bold text-gray-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RFQ Inbox - Takes 2 columns */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{t("rfq.title")}</h4>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">3 New</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">{t("rfq.viewAll")}</Button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {rfqList.map((rfq) => (
                            <div key={rfq.id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {rfq.client.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900 text-sm group-hover:text-matin-primary transition-colors">{rfq.client}</h5>
                                        <p className="text-xs text-gray-500">{rfq.equipment} • <span className="text-gray-400">{rfq.project}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-xs text-gray-400 hidden sm:block">{rfq.date}</p>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full" title={t("rfq.approve")}>
                                            <CheckCircle2 size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full" title={t("rfq.reject")}>
                                            <XCircle size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Bottom Row: Trust & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Trust & Verification */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="text-matin-action" />
                                <h4 className="font-bold text-lg">{t("trust.title")}</h4>
                            </div>
                            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                                Complete your verification to unlock premium features and increase your trust score.
                            </p>
                            <Button className="mt-6 bg-matin-action hover:bg-matin-action/90 text-white border-none rounded-lg font-semibold shadow-lg shadow-matin-action/20">
                                {t("trust.completeVerification")}
                            </Button>
                        </div>
                        <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <span className="text-4xl font-bold text-matin-action">85</span>
                            <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{t("trust.score")}</span>
                            <div className="h-1 w-full bg-gray-700 rounded-full mt-3 overflow-hidden">
                                <div className="h-full w-[85%] bg-matin-action rounded-full" />
                            </div>
                        </div>
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-matin-action/10 blur-[80px] rounded-full pointer-events-none" />
                </div>

                {/* Team Quick Access */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-gray-800">{t("team.title")}</h4>
                        <Button variant="outline" size="sm" className="gap-2 text-xs">
                            <Plus size={14} />
                            {t("team.addMember")}
                        </Button>
                    </div>

                    <div className="flex gap-4">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex flex-col items-center group cursor-pointer">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden mb-2 border-2 border-transparent group-hover:border-matin-primary transition-all">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-medium text-gray-700 group-hover:text-matin-primary transition-colors">{member.name}</span>
                                <span className="text-[10px] text-gray-400">{member.role}</span>
                            </div>
                        ))}
                        <div className="flex flex-col items-center justify-center cursor-pointer group">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-matin-primary group-hover:text-matin-primary transition-all">
                                <Plus size={24} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 mt-2 group-hover:text-matin-primary transition-colors">Add New</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
