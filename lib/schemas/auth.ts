import { z } from "zod"

type TFunction = (key: string, params?: any) => string;

// 1. Login schema
export const createLoginSchema = (t: TFunction) => z.object({
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
})

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

// 2. Registration Wizard schema
export const createRegisterWizardSchema = (t: TFunction) => z.object({
    // basic user info
    full_name: z.string().min(3, t("validation.fullNameMin", { min: 3 })),
    email: z.string().email(t("validation.emailInvalid")),
    phone: z.string().min(10, t("validation.phoneMin", { min: 10 })),
    password: z.string().min(8, t("validation.passwordMin", { min: 8 })),
    confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),

    // account type
    accountType: z.enum(["INDIVIDUAL", "COMPANY"]),

    // company info (optional at first, required if company)
    company_name: z.string().optional(),
    registration_number: z.string().optional(),
    vat_number: z.string().optional(),

}).superRefine((data, ctx) => {
    // Password match check
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.passwordMismatch"),
            path: ["confirmPassword"],
        });
    }

    // Company validation
    if (data.accountType === "COMPANY") {
        if (!data.company_name || data.company_name.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.companyNameRequired"),
                path: ["company_name"],
            });
        }

        if (!data.registration_number || data.registration_number.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("validation.crNumberRequired", { min: 10 }),
                path: ["registration_number"],
            });
        }
    }
})

export type RegisterWizardValues = z.infer<ReturnType<typeof createRegisterWizardSchema>>