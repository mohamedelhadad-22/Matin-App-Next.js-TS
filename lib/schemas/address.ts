import { z } from "zod";

export const addressSchema = z.object({
    addres_title: z.string().min(2, "مطلوب اسم للعنوان (مثال: المكتب الرئيسي)"),
    city: z.string().min(2, "المدينة مطلوبة"),
    district: z.string().min(2, "الحي مطلوب"),
    street_one: z.string().min(2, "اسم الشارع مطلوب"),
    building_number: z.string().optional(),

    latitude: z.number({ message: "يرجى تحديد الموقع على الخريطة" }).min(0.0001, "يرجى تحديد الموقع على الخريطة"),
    longitude: z.number({ message: "يرجى تحديد الموقع على الخريطة" }).min(0.0001, "يرجى تحديد الموقع على الخريطة"),

    is_default: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;