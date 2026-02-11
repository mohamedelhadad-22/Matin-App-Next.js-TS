"use client"

import { useState, use } from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useRouter } from "@/i18n/routing"
import {
    Loader2,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    LayoutDashboard
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
import { Checkbox } from "@/components/ui/checkbox" // تأكد إن عندك Checkbox component
import { toast } from "sonner"

// Services & Schemas
import { authService } from "@/services/auth"
import { useAuth } from "@/components/providers/auth-provider"
import { z } from "zod"
import { cn } from "@/lib/utils"

// تعريف Schema محلياً للسرعة (أو استوردها من lib/schemas/auth)
const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(1, "كلمة المرور مطلوبة"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {

    // 1. فك الـ Promise (Next.js 15)
    const { locale } = use(params)
    const isRTL = locale === 'ar'

    const t = useTranslations("Auth") // تأكد من وجود مفاتيح الترجمة
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. دالة تسجيل الدخول
    const onSubmit = async (values: LoginFormValues) => {
        setIsSubmitting(true)
        try {
            // الاتصال بالخدمة
            const response = await authService.login(values)

            // تحويل البيانات وتخزينها في الكونتكست
            // لاحظ: authService.login بيخزن في localStorage، وهنا بنحدث ال state
            const user = {
                id: response.user_id,
                full_name: response.full_name,
                username: response.username,
                email: response.username, // Assuming username is email
                phone: "", // Not returned in login response
                is_active: true, // Assuming active if login successful
                is_verified: response.is_verified,
                role: response.user_role,
                entity_type: response.entity_type,
                plan_type: response.plan_type,
                verification_status: response.verification_status,
            }

            login(response.access_token, user)

            toast.success(isRTL ? "تم تسجيل الدخول بنجاح" : "Logged in successfully")

            // التوجيه للداشبورد مباشرة
            router.push('/dashboard')

        } catch (error: any) {
            console.error(error)
            toast.error(error.message || (isRTL ? "بيانات الدخول غير صحيحة" : "Invalid credentials"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full lg:grid lg:grid-cols-2 h-screen overflow-hidden bg-gray-50 relative">

            {/* 🎨 الخلفية الجمالية (نفس الروح بس بتوزيع مختلف) */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            {/* كرات ضوئية متحركة لإعطاء حيوية */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-matin-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-matin-action/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            {/* ---------------- LEFT SIDE: FORM ---------------- */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-full overflow-y-auto relative z-10 custom-scrollbar">

                {/* الكارت الزجاجي */}
                <div className="mx-auto w-full max-w-md space-y-8 bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-matin-primary/5 border border-white/60 relative overflow-hidden">

                    {/* شريط علوي ملون (Design Accent) */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-matin-primary via-matin-secondary to-matin-action" />

                    {/* Header */}
                    <div className="text-center space-y-2 pt-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-matin-primary to-matin-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                            {isRTL ? 'م' : 'M'}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {isRTL ? 'مرحباً بعودتك! 👋' : 'Welcome Back! 👋'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isRTL
                                ? 'سجل دخولك لمتابعة أعمالك وإدارة معداتك'
                                : 'Sign in to manage your fleet and projects'}
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700">

                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem className="text-start space-y-1.5">
                                    <FormLabel className="font-semibold text-gray-700">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Mail className={`absolute top-3.5 w-5 h-5 text-gray-400 group-hover:text-matin-primary transition-colors ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                                            <Input
                                                type="email"
                                                dir="ltr"
                                                className={`h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-matin-primary/10 transition-all ${isRTL ? 'pr-11 text-right' : 'pl-11 text-left'}`}
                                                placeholder="name@example.com"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem className="text-start space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="font-semibold text-gray-700">{isRTL ? 'كلمة المرور' : 'Password'}</FormLabel>
                                        <Link href="/auth/forgot-password" className="text-xs font-medium text-matin-primary hover:text-matin-action hover:underline transition-colors">
                                            {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className={`absolute top-3.5 w-5 h-5 text-gray-400 group-hover:text-matin-primary transition-colors ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                className={`h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-matin-primary/10 transition-all ${isRTL ? 'pr-11 text-right' : 'pl-11 text-left'}`}
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute top-3.5 text-gray-400 hover:text-gray-600 transition-colors ${isRTL ? 'left-3.5' : 'right-3.5'}`}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-matin-primary to-matin-secondary hover:to-matin-primary shadow-lg shadow-matin-primary/20 hover:shadow-matin-primary/40 transition-all duration-300 transform hover:-translate-y-0.5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
                                {!isSubmitting && (isRTL ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />)}
                            </Button>

                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/50 backdrop-blur px-2 text-muted-foreground">{isRTL ? 'أو' : 'Or'}</span></div>
                    </div>

                    <div className="text-center text-sm pt-4 animate-in fade-in slide-in-from-bottom-4 delay-100">
                        <span className="text-gray-500">{isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}</span>
                        <Link href="/auth/register" className="mx-1 font-bold text-matin-primary hover:text-matin-action transition-colors hover:underline">
                            {isRTL ? 'أنشئ حساب جديد' : 'Create new account'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ---------------- RIGHT SIDE: IMAGE ---------------- */}
            <div className="hidden lg:flex relative h-full w-full items-center justify-center bg-gray-900 overflow-hidden group">
                {/* صورة الخلفية مع تأثير زووم بطيء */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070')] bg-cover bg-center transition-transform duration-[20s] ease-in-out group-hover:scale-110 opacity-40" />

                <div className="absolute inset-0 bg-gradient-to-t from-matin-primary/90 via-matin-secondary/80 to-matin-primary/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                {/* نصوص ترحيبية في الجانب الأيمن */}
                <div className="relative z-10 p-12 text-start max-w-lg">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-5xl font-bold mb-6 text-white leading-tight">
                        {isRTL ? 'قم بإدارة مشاريعك باحترافية.' : 'Manage your projects professionally.'}
                    </h2>
                    <p className="text-xl text-gray-100 opacity-90 leading-relaxed font-light">
                        {isRTL
                            ? 'تابع أداء أسطولك، راقب الفواتير، وتحكم في كل تفصيلة من مكان واحد.'
                            : 'Track fleet performance, monitor invoices, and control every detail from one place.'}
                    </p>

                    {/* Stats Card (Decor) */}
                    <div className="mt-12 flex gap-6">
                        <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <p className="text-3xl font-bold text-white">12k+</p>
                            <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">{isRTL ? 'معدة متاحة' : 'Equipment'}</p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <p className="text-3xl font-bold text-matin-action">99%</p>
                            <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">{isRTL ? 'رضا عملاء' : 'Satisfaction'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}