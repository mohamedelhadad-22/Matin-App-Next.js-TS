"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@/i18n/routing" // تأكد إنك بتستخدم الراوتر بتاع الـ i18n
import { equipmentSchema, type EquipmentFormValues } from "@/lib/AddEquipment-schemas"

// Components
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { buttonVariants } from "@/components/ui/button"

export default function NewEquipmentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. إعداد الـ Hook
    const {
        register, // دي اللي بتمسك الـ Input
        handleSubmit, // دي اللي بتتعامل مع الـ Submit
        formState: { errors }, // دي اللي شايلة الأخطاء
    } = useForm<EquipmentFormValues>({
        resolver: zodResolver(equipmentSchema), // ربطنا القوانين بالفورم
        defaultValues: {
            status: "available", // قيمة افتراضية
        },
    })

    // 2. دالة الإرسال (هتشتغل بس لو مفيش أخطاء)
    const onSubmit = async (data: EquipmentFormValues) => {
        setIsSubmitting(true)

        // محاكاة إرسال للسيرفر (Seniors بيعملوا كدة قبل الباك اند)
        console.log("Form Data Submitted:", data)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // استنى ثانية

        setIsSubmitting(false)
        router.push("/equipment") // ارجع للجدول
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/equipment" className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Equipment</h1>
                    <p className="text-gray-500 text-sm">Fill in the details to register new machinery.</p>
                </div>
            </div>

            {/* The Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">

                {/* Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="name"
                        placeholder="e.g. Caterpillar 320D"
                        {...register("name")} // الربط السحري
                        className={cn(errors.name && "border-red-500 focus-visible:ring-red-500")} // لون أحمر لو فيه خطأ
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Field (Native Select for now) */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <select
                            id="category"
                            {...register("category")}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matin-primary/50"
                        >
                            <option value="">Select Category</option>
                            <option value="Heavy Machinery">Heavy Machinery</option>
                            <option value="Earthmovers">Earthmovers</option>
                            <option value="Loaders">Loaders</option>
                            <option value="Generators">Generators</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    {/* Daily Rate Field */}
                    <div className="space-y-2">
                        <Label htmlFor="dailyRate">Daily Rate (SAR) <span className="text-red-500">*</span></Label>
                        <Input
                            id="dailyRate"
                            type="number"
                            placeholder="0.00"
                            {...register("dailyRate")}
                            className={cn(errors.dailyRate && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.dailyRate && <p className="text-red-500 text-xs mt-1">{errors.dailyRate.message}</p>}
                    </div>
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <select
                        id="status"
                        {...register("status")}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matin-primary/50"
                    >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Link
                        href="/equipment"
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Create Equipment"}
                    </Button>
                </div>

            </form>
        </div>
    )
}