"use client"

import { useTranslations } from "next-intl"
import {
    Clock,
    Truck,
    CheckCircle2,
    RotateCcw,
    ChevronRight,
    Search,
    ShoppingBag,
    Plus
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Mock Data ---
const activeRentals = [
    { id: 1, name: "Caterpillar D8T Dozer", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=200", daysLeft: 5, totalDays: 15, status: "Active" },
    { id: 2, name: "Komatsu PC200 Excavator", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=200", daysLeft: 12, totalDays: 30, status: "Active" },
    { id: 3, name: "JCB 3CX Backhoe", image: "https://images.unsplash.com/photo-1519003300449-424adfae484b?q=80&w=200", daysLeft: 2, totalDays: 7, status: "Expiring Soon" },
]

const recentOrders = [
    { id: 101, equipment: "Crane 50T", date: "Today", status: "In Transit", step: 3 },
    { id: 102, equipment: "Forklift 3T", date: "Yesterday", status: "Approved", step: 2 },
    { id: 103, equipment: "Generator 100kVA", date: "Oct 24", status: "Delivered", step: 4 },
]

const spendingData = [
    { month: 'Jan', amount: 5000 },
    { month: 'Feb', amount: 7200 },
    { month: 'Mar', amount: 4500 },
    { month: 'Apr', amount: 11000 },
    { month: 'May', amount: 8000 },
    { month: 'Jun', amount: 9500 },
]

const favorites = [
    { id: 1, name: "Bobcat S590", type: "Skid Steer" },
    { id: 2, name: "CAT 140K", type: "Motor Grader" },
    { id: 3, name: "Dynapac CA250", type: "Roller" },
]

export function IndividualDashboard() {
    const t = useTranslations("dashboard.overview.individual")

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Active Rentals (Horizontal Scroll) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-matin-primary" />
                        {t("activeRentals.title")}
                    </h2>
                    <Button variant="link" className="text-matin-primary">{t("activeRentals.viewAll")}</Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {activeRentals.map((rental) => (
                        <div key={rental.id} className="min-w-[280px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 snap-center hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-3 right-3 z-10">
                                <Badge variant={rental.status === "Expiring Soon" ? "destructive" : "secondary"} className="text-xs">
                                    {rental.status}
                                </Badge>
                            </div>

                            <img src={rental.image} alt={rental.name} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-500" />

                            <h3 className="font-bold text-gray-900 mb-1 truncate">{rental.name}</h3>
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                <span>Rental ID: #{rental.id}234</span>
                                <span>{t("activeRentals.timeRemaining", { days: rental.daysLeft })}</span>
                            </div>

                            <Progress value={(1 - rental.daysLeft / rental.totalDays) * 100} className="h-2 mb-4" />

                            <Button className="w-full bg-gray-50 text-gray-900 border border-gray-200 hover:bg-matin-primary hover:text-white hover:border-transparent transition-colors">
                                {t("activeRentals.return")}
                            </Button>
                        </div>
                    ))}
                    <div className="min-w-[100px] flex items-center justify-center">
                        <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-dashed border-2">
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. Order Status (Timeline) */}
                <Card className="p-6 border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Truck className="text-blue-500" />
                            {t("orders.title")}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {recentOrders.map((order, index) => (
                            <div key={order.id} className="relative pl-8 last:pb-0">
                                {/* Timeline Line */}
                                {index !== recentOrders.length - 1 && (
                                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-100" />
                                )}

                                {/* Status Icon */}
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {order.status === 'Delivered' ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{order.equipment}</h4>
                                        <p className="text-sm text-gray-500">Order #{order.id} • {order.date}</p>
                                    </div>
                                    <Badge variant="outline" className={`${order.status === 'Delivered' ? 'border-green-200 text-green-700 bg-green-50' : 'border-blue-200 text-blue-700 bg-blue-50'}`}>
                                        {order.status}
                                    </Badge>
                                </div>
                                <div className="mt-3">
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${order.step * 25}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
                                        <span>Ordered</span>
                                        <span>Approved</span>
                                        <span>Shipped</span>
                                        <span>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 3. Right Col: Spending & Favorites */}
                <div className="space-y-6">

                    {/* Spending Chart */}
                    <Card className="p-6 border-gray-100 shadow-sm rounded-2xl bg-gray-900 text-white border-none">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg">{t("spending.title")}</h3>
                            <p className="text-3xl font-bold mt-2 text-matin-action">SAR 45,200</p>
                            <p className="text-xs text-gray-400">{t("spending.total")}</p>
                        </div>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={spendingData}>
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="amount" fill="#EAB308" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Quick Reorder */}
                    <Card className="p-6 border-gray-100 shadow-sm rounded-2xl">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <RotateCcw className="text-gray-400" size={18} />
                            {t("quickOrder.title")}
                        </h3>
                        <div className="space-y-3">
                            {favorites.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-matin-primary group-hover:bg-primary/10 transition-colors">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.type}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-matin-primary">
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    )
}
