"use client"

import { useState, use } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter } from "@/i18n/routing"
import {
    User,
    Building2,
    Check,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Eye,
    EyeOff,
    Mail,
    Phone,
    FileText,
    Hash
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { toast } from "sonner"

// Services & Schemas
import { authService } from "@/services/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { createRegisterWizardSchema, RegisterWizardValues } from "@/lib/schemas/auth"
import { cn } from "@/lib/utils"

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params)

    const t = useTranslations("auth")
    const [step, setStep] = useState<1 | 2>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const isRTL = locale === 'ar'

    const form = useForm<RegisterWizardValues>({
        resolver: zodResolver(createRegisterWizardSchema(t)),
        defaultValues: {
            accountType: "INDIVIDUAL",
            full_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            company_name: "",
            registration_number: "",
            vat_number: "",
        },
    })

    const accountType = form.watch("accountType")

    // 3. from submit logic
    const onSubmit = async (values: RegisterWizardValues) => {
        setIsSubmitting(true)
        try {
            // Create Account
            await authService.register(values)

            // Auto Login
            const loginResponse = await authService.login({
                email: values.email,
                password: values.password
            })

            // Save Session
            const user = {
                id: loginResponse.user_id,
                full_name: loginResponse.full_name,
                email: loginResponse.username,
                role: loginResponse.user_role,
                entity_type: loginResponse.entity_type,
                phone: values.phone,
            };

            login(loginResponse.access_token, user)

            toast.success(t('register.success'))

            // Redirect
            if (values.accountType === "COMPANY") {
                router.push('/dashboard/')
            } else {
                router.push('/dashboard/')
            }

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-screen overflow-hidden bg-gray-50 relative">

            {/* Dots & Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            {/* Glowing Circles */}
            <div className="absolute -top-20 -left-20 ltr:-right-20 rtl:-left-20 w-96 h-96 bg-matin-action/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-0 ltr:left-0 rtl:right-0 w-[500px] h-[500px] bg-matin-primary/5 rounded-full blur-3xl pointer-events-none" />

            {/* ---------------- LEFT SIDE: FORM ---------------- */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto relative z-10 custom-scrollbar">

                {/* Glass Card */}
                <div className="mx-auto w-full max-w-md space-y-8 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-matin-primary/5 border border-white/40 relative">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-matin-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-matin-primary font-bold text-2xl shadow-sm">
                            {isRTL ? 'م' : 'M'}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {t('register.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {step === 1 ? t('register.subtitle') : t('register.step2Title')}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-2 mb-6" dir="ltr">
                        <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${step >= 1 ? 'w-1/2 bg-matin-primary' : 'w-0 bg-gray-200'}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-500 ease-out ${step >= 2 ? 'w-1/2 bg-matin-primary' : 'w-full bg-gray-200'}`} />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* ================= STEP 1 ================= */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    {/* Option Individual */}
                                    <div
                                        onClick={() => form.setValue("accountType", "INDIVIDUAL")}
                                        className={cn(
                                            "group cursor-pointer relative flex items-start gap-4 p-5 border-2 rounded-2xl transition-all duration-300",
                                            "hover:shadow-lg hover:border-matin-primary/50 hover:bg-white",
                                            accountType === "INDIVIDUAL"
                                                ? "border-matin-primary bg-matin-primary/5 shadow-md ring-1 ring-matin-primary/20"
                                                : "border-gray-100 bg-white/50 text-gray-400"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-xl transition-colors duration-300",
                                            accountType === "INDIVIDUAL" ? "bg-matin-primary text-white shadow-lg shadow-matin-primary/30" : "bg-gray-100 text-gray-400 group-hover:bg-matin-primary/10 group-hover:text-matin-primary"
                                        )}>
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-start space-y-1">
                                            <h3 className={cn("font-bold text-lg transition-colors", accountType === "INDIVIDUAL" ? "text-gray-900" : "text-gray-500 group-hover:text-gray-800")}>
                                                {t('register.individual')}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {t('register.individualDesc')}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all absolute top-5 ltr:right-5 rtl:left-5",
                                            accountType === "INDIVIDUAL" ? "border-matin-primary bg-matin-primary text-white" : "border-gray-200"
                                        )}>
                                            {accountType === "INDIVIDUAL" && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>

                                    {/* Option Company */}
                                    <div
                                        onClick={() => form.setValue("accountType", "COMPANY")}
                                        className={cn(
                                            "group cursor-pointer relative flex items-start gap-4 p-5 border-2 rounded-2xl transition-all duration-300",
                                            "hover:shadow-lg hover:border-matin-primary/50 hover:bg-white",
                                            accountType === "COMPANY"
                                                ? "border-matin-primary bg-matin-primary/5 shadow-md ring-1 ring-matin-primary/20"
                                                : "border-gray-100 bg-white/50 text-gray-400"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-3 rounded-xl transition-colors duration-300",
                                            accountType === "COMPANY" ? "bg-matin-primary text-white shadow-lg shadow-matin-primary/30" : "bg-gray-100 text-gray-400 group-hover:bg-matin-primary/10 group-hover:text-matin-primary"
                                        )}>
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-start space-y-1">
                                            <h3 className={cn("font-bold text-lg transition-colors", accountType === "COMPANY" ? "text-gray-900" : "text-gray-500 group-hover:text-gray-800")}>
                                                {t('register.company')}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {t('register.companyDesc')}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all absolute top-5 ltr:right-5 rtl:left-5",
                                            accountType === "COMPANY" ? "border-matin-primary bg-matin-primary text-white" : "border-gray-200"
                                        )}>
                                            {accountType === "COMPANY" && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>

                                    <Button type="button" onClick={() => setStep(2)} className="mt-6 w-full bg-matin-primary h-12 text-lg rounded-xl shadow-lg shadow-matin-primary/20 hover:shadow-matin-primary/40 transition-all">
                                        {t('register.continue')}
                                        {isRTL ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                                    </Button>
                                </div>
                            )}

                            {/* ================= STEP 2 ================= */}
                            {step === 2 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-8">

                                    {/* Company Fields */}
                                    {accountType === "COMPANY" && (
                                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4 mb-6">
                                            <div className="flex items-center gap-2 text-matin-primary mb-2">
                                                <Building2 className="w-5 h-5" />
                                                <span className="font-bold text-sm">{t('register.company')}</span>
                                            </div>
                                            <FormField control={form.control} name="company_name" render={({ field }) => (
                                                <FormItem className="text-start"><FormLabel>{t('fields.companyName')}</FormLabel><FormControl><Input className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="registration_number" render={({ field }) => (
                                                    <FormItem className="text-start"><FormLabel>{t('fields.crNumber')}</FormLabel><FormControl><Input className="bg-white" placeholder="70xxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="vat_number" render={({ field }) => (
                                                    <FormItem className="text-start"><FormLabel>{t('fields.vatNumber')}</FormLabel><FormControl><Input className="bg-white" placeholder="30xxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Personal Fields */}
                                    <FormField control={form.control} name="full_name" render={({ field }) => (
                                        <FormItem className="text-start">
                                            <FormLabel>{t('fields.fullName')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                                    <Input className={`${isRTL ? 'pr-10' : 'pl-10'}`} {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem className="text-start">
                                            <FormLabel>{t('fields.email')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                                    <Input type="email" dir="ltr" className={`text-left ${isRTL ? 'pr-10' : 'pl-10'}`} {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem className="text-start">
                                            <FormLabel>{t('fields.phone')}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className={`absolute top-3 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                                                    <Input type="tel" dir="ltr" className={`text-left ${isRTL ? 'pr-10' : 'pl-10'}`} placeholder="05xxxxxxxx" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {/* Passwords */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem className="text-start">
                                                <FormLabel>{t('fields.password')}</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type={showPassword ? "text" : "password"} {...field} />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-3' : 'right-3'}`}>
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem className="text-start">
                                                <FormLabel>{t('fields.confirmPassword')}</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="px-6 h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-matin-primary">
                                            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                                        </Button>
                                        <Button type="submit" className="flex-1 bg-matin-primary h-12 text-lg rounded-xl shadow-lg shadow-matin-primary/20 hover:shadow-matin-primary/40 hover:bg-matin-primary/90 transition-all" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : t('register.submit')}
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </Form>

                    {/* Footer Link */}
                    <div className="text-center text-sm pt-4">
                        <span className="text-gray-500">{t('register.alreadyHaveAccount')}</span>
                        <Link href="/auth/login" className="mx-1 font-bold text-matin-primary hover:text-matin-action transition-colors hover:underline">
                            {t('register.login')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ---------------- RIGHT SIDE: IMAGE ---------------- */}
            <div className="hidden lg:flex relative h-full w-full items-center justify-center bg-white overflow-hidden">
                <div className="absolute inset-0 bg-matin-secondary opacity-90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Illustration */}
                <img
                    src="/Mateen_2.png"
                    alt="Join Matin"
                    className="relative z-10 w-full h-full max-w-[85%] max-h-[60%] object-contain mb-20 transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
                />

                {/* Welcome Texts */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-16 px-12 text-start">
                    <h2 className="text-4xl font-bold mb-4 text-white leading-tight">
                        {t('register.promoTitle')}
                    </h2>
                    <p className="text-lg text-gray-200 opacity-90 leading-relaxed max-w-lg">
                        {t('register.promoDesc')}
                    </p>
                </div>
            </div>
        </div>
    )
}  