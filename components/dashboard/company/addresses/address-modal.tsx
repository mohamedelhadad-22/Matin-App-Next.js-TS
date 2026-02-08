"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Address } from "@/types/company"
// استيراد السكيما من الملف الخارجي (زي ما طلبت) ✅
import { addressSchema, AddressFormValues } from "@/lib/schemas/address"

// Dynamic Map
const LocationPicker = dynamic(() => import("@/components/ui/location-picker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">جاري تحميل الخريطة...</div>
})

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    addressToEdit?: Address | null
}

export function AddressModal({ isOpen, onClose, onSuccess, addressToEdit }: AddressModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. Fix TypeScript: Use the exported Type 'AddressFormValues'
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        // 2. Fix Boolean Error: Ensure defaultValues match the schema exactly
        defaultValues: {
            addres_title: "",
            city: "",
            district: "",
            street_one: "",
            building_number: "",
            latitude: 0,
            longitude: 0,
            is_default: false, // Explicit boolean
        },
    })

    // Reset form
    useEffect(() => {
        if (isOpen) {
            if (addressToEdit) {
                form.reset({
                    addres_title: addressToEdit.addres_title,
                    city: addressToEdit.city,
                    district: addressToEdit.district,
                    street_one: addressToEdit.street_one,
                    building_number: addressToEdit.building_number || "",
                    latitude: Number(addressToEdit.latitude),
                    longitude: Number(addressToEdit.longitude),
                    is_default: addressToEdit.is_default,
                })
            } else {
                form.reset({
                    addres_title: "",
                    city: "",
                    district: "",
                    street_one: "",
                    building_number: "",
                    latitude: 0,
                    longitude: 0,
                    is_default: false,
                })
            }
        }
    }, [isOpen, addressToEdit, form])

    const onSubmit = async (values: AddressFormValues) => {
        setIsSubmitting(true)
        try {
            console.log("Submitting:", values);
            // API Call Simulation
            toast.success(addressToEdit ? "تم تحديث العنوان" : "تم إضافة العنوان")
            onSuccess()
            onClose()
        } catch (error) {
            toast.error("حدث خطأ")
        } finally {
            setIsSubmitting(false)
        }
    }

    // 3. هذه الدالة هي اللي بتربط الخريطة بالفورم
    // لما الخريطة تبعت داتا، الفورم بتتملي أوتوماتيك
    const handleLocationSelect = (data: { lat: number; lng: number; city?: string; district?: string; street?: string }) => {
        form.setValue("latitude", data.lat, { shouldValidate: true });
        form.setValue("longitude", data.lng, { shouldValidate: true });

        // Auto-fill fields if data is returned from Reverse Geocoding
        if (data.city) form.setValue("city", data.city, { shouldValidate: true });
        if (data.district) form.setValue("district", data.district, { shouldValidate: true });
        if (data.street) form.setValue("street_one", data.street, { shouldValidate: true });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{addressToEdit ? "تعديل العنوان" : "إضافة عنوان جديد"}</DialogTitle>
                    <DialogDescription>ابحث عن الموقع أو اضغط على الخريطة لتعبئة البيانات تلقائياً.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Map Section with Search & Sync */}
                        <div className="space-y-2">
                            <FormLabel>الموقع الجغرافي <span className="text-red-500">*</span></FormLabel>
                            <LocationPicker
                                value={addressToEdit ? { lat: Number(addressToEdit.latitude), lng: Number(addressToEdit.longitude) } : undefined}
                                onLocationSelect={handleLocationSelect} // الربط السحري هنا
                            />
                            {form.formState.errors.latitude && (
                                <p className="text-sm text-red-500 font-medium">{form.formState.errors.latitude.message}</p>
                            )}
                        </div>

                        {/* Inputs Grid - هتتملي لوحدها لما تختار من الخريطة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="addres_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم العنوان</FormLabel>
                                        <FormControl><Input placeholder="مثال: المكتب الرئيسي" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>المدينة</FormLabel>
                                        <FormControl><Input placeholder="الرياض" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الحي</FormLabel>
                                        <FormControl><Input placeholder="حي العليا" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="street_one"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الشارع</FormLabel>
                                        <FormControl><Input placeholder="طريق الملك فهد" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="building_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم المبنى (اختياري)</FormLabel>
                                        <FormControl><Input placeholder="12" {...field} value={field.value || ''} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Checkbox Fixed */}
                        <FormField
                            control={form.control}
                            name="is_default"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none mr-2">
                                        <FormLabel>تعيين كعنوان رئيسي</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-matin-primary">
                                {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                حفظ العنوان
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}