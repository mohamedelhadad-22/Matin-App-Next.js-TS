import { z } from "zod"

export const equipmentSchema = z.object({
    name: z.string().min(3, { message: "اسم المعدة مطلوب (3 أحرف على الأقل)" }),
    description: z.string().min(10, { message: "الوصف يجب أن يكون 10 أحرف على الأقل" }),
    dailyRate: z.coerce.number().min(1, { message: "سعر الإيجار مطلوب" }),
    category: z.string().min(1, { message: "يرجى اختيار الفئة" }),
    images: z.array(z.string()).min(1, { message: "يجب رفع صورة واحدة على الأقل" }),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>