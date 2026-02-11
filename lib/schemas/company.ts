import { z } from "zod"

export const createCompanySchema = z.object({
    name: z.string().min(3, "اسم الشركة مطلوب (3 أحرف على الأقل)"),
    registration_number: z.string().min(10, "رقم السجل التجاري يجب أن يكون 10 أرقام"),
    vat_number: z.string().optional(),
})

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>