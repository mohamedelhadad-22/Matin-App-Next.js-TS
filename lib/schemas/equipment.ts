import { z } from "zod"

// Helper function for translations
type TFunction = (key: string, params?: any) => string

// --- Enums & Constants ---
export const EquipmentCategories = [
    { value: "EARTHMOVING", label: "Earthmoving" },
    { value: "GENERATORS", label: "Generators" },
    { value: "LIFTING", label: "Lifting (Cranes/Forklifts)" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "OTHERS", label: "Others" }
] as const

export const EquipmentConditions = [
    { value: "NEW", label: "New" },
    { value: "EXCELLENT", label: "Excellent" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" }
] as const

// --- Dynamic Specifications Schema (JSONB) ---
// We'll use a Record<string, any> but validate specific known keys based on category in the UI
// Zod will just ensure it's an object for now, refined by category later if needed
const specificationsSchema = z.record(z.string(), z.any())

// --- Main Wizard Schema ---
export const createEquipmentSchema = (t: TFunction) => z.object({
    // Step 1: Basic Details
    name: z.string().min(3, t("validation.equipmentNameMin", { min: 3 })),
    brand: z.string().min(2, t("validation.brandRequired")),
    model: z.string().min(2, t("validation.modelRequired")),
    year: z.coerce.number()
        .min(1900, t("validation.yearInvalid"))
        .max(new Date().getFullYear() + 1, t("validation.yearInvalid")),
    category: z.string().min(1, t("validation.categoryRequired")),
    condition: z.string().optional(),

    // Step 2: Dynamic Specifications
    specifications: specificationsSchema.optional(),

    // Step 3: Pricing & Availability
    dailyRate: z.coerce.number().min(1, t("validation.dailyPriceRequired")),
    weeklyRate: z.coerce.number().optional(),
    monthlyRate: z.coerce.number().optional(),

    isOperatorIncluded: z.boolean().default(false),
    operatorCost: z.coerce.number().optional(), // If included or separate option

    city: z.string().min(2, t("validation.cityRequired")),
    address: z.string().optional(),

    // Step 4: Media
    images: z.array(z.any()).min(1, t("validation.imageRequired")), // Array of File objects or strings (urls)
    primaryImageIndex: z.number().default(0),
}).superRefine((data, ctx) => {
    // Custom validation: if operator is included, maybe cost is zero or specific logic? 
    // For now, no complex cross-field validation required by prompt, 
    // but we could enforce operatorCost if isOperatorIncluded is true/false depending on business logic.
})

export type EquipmentFormValues = z.infer<ReturnType<typeof createEquipmentSchema>>