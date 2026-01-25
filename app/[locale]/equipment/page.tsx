import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Equipment, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { buttonVariants } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

// Mock Data (Simulator for Backend API)
const data: Equipment[] = [
    { id: "1", name: "CAT Excavator 320", status: "available", category: "Heavy Machinery", dailyRate: 1500 },
    { id: "2", name: "Komatsu Dozer D85", status: "rented", category: "Earthmovers", dailyRate: 2200 },
    { id: "3", name: "Bobcat S540", status: "maintenance", category: "Loaders", dailyRate: 600 },
    { id: "4", name: "JCB Backhoe 3CX", status: "available", category: "Heavy Machinery", dailyRate: 1200 },
    { id: "5", name: "Hitachi ZAXIS 200", status: "rented", category: "Heavy Machinery", dailyRate: 1600 },
    { id: "6", name: "CAT Excavator 320", status: "available", category: "Heavy Machinery", dailyRate: 1500 },
    { id: "7", name: "Komatsu Dozer D85", status: "rented", category: "Earthmovers", dailyRate: 2200 },
    { id: "8", name: "Bobcat S540", status: "maintenance", category: "Loaders", dailyRate: 600 },
    { id: "9", name: "JCB Backhoe 3CX", status: "available", category: "Heavy Machinery", dailyRate: 1200 },
    { id: "10", name: "Hitachi ZAXIS 200", status: "rented", category: "Heavy Machinery", dailyRate: 1600 },
    { id: "11", name: "CAT Excavator 320", status: "available", category: "Heavy Machinery", dailyRate: 1500 },
    { id: "12", name: "Komatsu Dozer D85", status: "rented", category: "Earthmovers", dailyRate: 2200 },
    { id: "13", name: "Bobcat S540", status: "maintenance", category: "Loaders", dailyRate: 600 },
    { id: "14", name: "JCB Backhoe 3CX", status: "available", category: "Heavy Machinery", dailyRate: 1200 },
    { id: "15", name: "Hitachi ZAXIS 200", status: "rented", category: "Heavy Machinery", dailyRate: 1600 },
]

export default async function EquipmentPage() {
    const t = await getTranslations('Sidebar');

    return (
        <div className="container mx-auto py-10">

            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Equipment List</h1>
                    <p className="text-gray-500 mt-1">Manage your fleet and track status</p>
                </div>
                <Link
                    href="/equipment/new"
                    className={cn(buttonVariants({ variant: "default" }))}
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Equipment
                </Link>
            </div>

            {/* The Reusable Data Table */}
            <DataTable columns={columns} data={data} searchKey="name" />

        </div>
    )
}