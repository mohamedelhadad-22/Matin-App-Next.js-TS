"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { BookingFormValues } from "@/lib/schemas/booking"

interface BookingFormProps {
    form: UseFormReturn<BookingFormValues>
}

export function BookingForm({ form }: BookingFormProps) {
    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">بيانات المستأجر</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* الاسم */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الاسم بالكامل</FormLabel>
                                <FormControl>
                                    <Input placeholder="محمد..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* الجوال */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>رقم الجوال</FormLabel>
                                <FormControl>
                                    <Input placeholder="05xxxxxxxx" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* الشركة */}
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>اسم الشركة (اختياري)</FormLabel>
                                <FormControl>
                                    <Input placeholder="شركة..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </Card>
    )
}