"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// 👇 زودنا bookingSchema هنا
import { bookingSchema, BookingFormValues } from "@/lib/schemas/booking"

// Imports للكومبوننتس الجديدة
import { BookingForm } from "@/components/marketplace/booking-form"
import { BookingSummary } from "@/components/marketplace/booking-summary"
import { Form } from "@/components/ui/form"

// Imports للتقويم والـ Modal
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog"
import { DateRange } from "react-day-picker"
import { addDays, format, differenceInDays } from "date-fns"
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const DAILY_RATE = 1500;

export default function BookingPage({ params }: { params: { id: string } }) {
    const t = useTranslations("marketplace.equipment.book")
    const router = useRouter()

    // 1. States
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 3),
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [numberOfMonths, setNumberOfMonths] = useState(2)

    // Responsive Calendar Month Count
    useEffect(() => {
        const handleResize = () => {
            setNumberOfMonths(window.innerWidth < 768 ? 1 : 2)
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // 2. Setup Form (Zod + Hook Form)
    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { fullName: "", phone: "", companyName: "" },
    })

    // 3. Logic
    const daysCount = (date?.from && date?.to) ? differenceInDays(date.to, date.from) + 1 : 0;

    // 4. Submit Handler
    const onSubmit = async (data: BookingFormValues) => {
        if (daysCount === 0) {
            alert(t("selectDatesFirst"))
            return;
        }

        setIsSubmitting(true)
        console.log("Valid Data:", data) // الداتا هنا جاهزة ونظيفة

        // محاكاة
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false)
        setShowSuccess(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-2 space-y-6">
                        {/* Calendar Section (ممكن تفصله كمان لو حابب) */}
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CalendarIcon className="text-matin-primary" />
                                {t("date")}
                            </h3>
                            <div className="grid gap-2">
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date?.from ? (date.to ? <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</> : format(date.from, "LLL dd, y")) : <span>{t("selectDates")}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start">
                                        {/* Quick Select Buttons */}
                                        <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50/50">
                                            {[3, 7, 30].map((days) => (
                                                <Button
                                                    key={days}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-7 bg-white"
                                                    onClick={() => {
                                                        const from = new Date()
                                                        const to = addDays(from, days)
                                                        setDate({ from, to })
                                                        setIsCalendarOpen(false)
                                                    }}
                                                >
                                                    {t("days", { count: days })}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs h-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => setDate(undefined)}
                                            >
                                                {t("clear")}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-xs h-7 bg-matin-primary text-white hover:bg-matin-primary/90"
                                                onClick={() => setIsCalendarOpen(false)}
                                                disabled={!date?.from || !date?.to}
                                            >
                                                {t("select")}
                                            </Button>
                                        </div>
                                        <Calendar
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={numberOfMonths}
                                            disabled={{ before: new Date() }}
                                            fromDate={new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </Card>

                        {/* 👇 Form Section (استخدمنا الكومبوننت الجديد) */}
                        <Form {...form}>
                            <form id="booking-form-id" onSubmit={form.handleSubmit(onSubmit)}>
                                <BookingForm form={form} />
                            </form>
                        </Form>

                    </div>

                    {/* 👇 Summary Section (استخدمنا الكومبوننت الجديد) */}
                    <div className="md:col-span-1">
                        <BookingSummary
                            dailyRate={DAILY_RATE}
                            daysCount={daysCount}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                </div>
            </div>

            {/* Success Modal */}
            <AlertDialogDescription className="text-center space-y-2">
                <span className="block font-bold text-gray-900">تم إرسال طلب عرض السعر بنجاح! 🎉</span>
                <span className="block">
                    سيقوم المورد <strong>(شركة ATAD)</strong> بمراجعة تفاصيل طلبك والرد عليك بعرض سعر نهائي قريباً.
                    يمكنك متابعة حالة الطلب من لوحة التحكم.
                </span>
            </AlertDialogDescription>

        </div>
    )
}