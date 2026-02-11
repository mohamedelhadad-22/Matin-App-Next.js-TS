"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { companyService } from "@/services/companyService"
import { useAuth } from "@/components/providers/auth-provider"
import { createCompanySchema, CreateCompanyFormValues } from "@/lib/schemas/company"

export default function OnboardingPage() {
    const [step, setStep] = useState<'CHOICE' | 'CREATE_COMPANY'>('CHOICE')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { refreshUser } = useAuth()

    const form = useForm<CreateCompanyFormValues>({
        resolver: zodResolver(createCompanySchema),
        defaultValues: { name: "", registration_number: "", vat_number: "" },
    })

    const onSubmit = async (values: CreateCompanyFormValues) => {
        setIsSubmitting(true)
        try {
            await companyService.createCompany(values)
            toast.success("تم إنشاء ملف الشركة بنجاح!")
            await refreshUser()
            router.push('/dashboard')
        } catch (error: any) {
            toast.error("فشل إنشاء الشركة.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkip = () => {
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-matin-primary">أهلاً بك في متين</CardTitle>
                    <CardDescription>لنقم بإعداد حسابك للبدء.</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'CHOICE' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-center mb-6">كيف تخطط لاستخدام المنصة؟</h3>
                            <button onClick={() => setStep('CREATE_COMPANY')} className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-matin-primary hover:bg-matin-primary/5 transition-all group text-right">
                                <div className="bg-matin-primary/10 p-3 rounded-full group-hover:bg-matin-primary group-hover:text-white transition-colors"><Building2 className="w-6 h-6" /></div>
                                <div><h4 className="font-bold text-gray-900">صاحب شركة</h4><p className="text-sm text-gray-500">أريد تأجير معداتي أو استئجار معدات لمشاريعي باسم الشركة.</p></div>
                            </button>
                            <button onClick={handleSkip} className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all group text-right">
                                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-600 group-hover:text-white transition-colors"><User className="w-6 h-6" /></div>
                                <div><h4 className="font-bold text-gray-900">مستخدم فرد</h4><p className="text-sm text-gray-500">أريد تصفح المعدات واستئجارها بصفتي الشخصية.</p></div>
                            </button>
                        </div>
                    )}
                    {step === 'CREATE_COMPANY' && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right" dir="rtl">
                                <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-matin-primary/10 text-matin-primary mb-2"><Building2 className="w-6 h-6" /></div><h3 className="font-bold text-lg">بيانات المنشأة</h3></div>
                                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>اسم الشركة الرسمي</FormLabel><FormControl><Input placeholder="شركة..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="registration_number" render={({ field }) => (<FormItem><FormLabel>رقم السجل التجاري</FormLabel><FormControl><Input placeholder="1010xxxxxx" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="vat_number" render={({ field }) => (<FormItem><FormLabel>الرقم الضريبي (اختياري)</FormLabel><FormControl><Input placeholder="300xxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="flex gap-3 pt-4"><Button type="button" variant="outline" onClick={() => setStep('CHOICE')} className="flex-1">رجوع</Button><Button type="submit" className="flex-[2] bg-matin-primary" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "إنشاء الشركة"}</Button></div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}