import { z } from "zod"

// قواعد التحقق الخاصة بحجز المعدة
export const bookingSchema = z.object({
    fullName: z.string().min(3, {
        message: "الاسم يجب أن يكون 3 أحرف على الأقل"
    }),
    phone: z.string().regex(/^(05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, {
        message: "رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)"
    }),
    companyName: z.string().optional(),
})

// استخراج النوع (Type) تلقائياً عشان نستخدمه في الفرونت إند
export type BookingFormValues = z.infer<typeof bookingSchema>