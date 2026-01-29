import { z } from "zod"

export const equipmentSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(100, "Name must be at most 100 characters long"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters long")
        .max(1000, "Description must be at most 1000 characters long"),
    price: z
        .number()
        .min(0, "Price must be at least 0")
        .max(1000000, "Price must be at most 1000000"),
    category: z
        .string()
        .min(1, { message: "Please select a category" }),

    status: z.enum(["available", "rented", "maintenance"], {
        errorMap: () => ({ message: "Please select a valid status" }),
    }),

    dailyRate: z.coerce
        .number()
        .min(1, { message: "Daily rate must be a positive number" }),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>