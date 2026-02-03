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

import { useTranslations } from "next-intl"

interface BookingFormProps {
    form: UseFormReturn<BookingFormValues>
}

export function BookingForm({ form }: BookingFormProps) {
    const t = useTranslations("marketplace.equipment.book")

    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">{t("renterDetails")}</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* الاسم */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("fullName")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("fullNamePlaceholder")} {...field} />
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
                                <FormLabel>{t("phone")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("phonePlaceholder")} {...field} />
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
                                <FormLabel>{t("company")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("companyPlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>{t("notes")}</FormLabel>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder={t("notesPlaceholder")}
                                        {...field}
                                    />
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