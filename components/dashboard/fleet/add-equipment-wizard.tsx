
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
    ChevronRight,
    ChevronLeft,
    UploadCloud,
    X,
    Check,
    Plus,
    Trash2,
    ImageIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

import {
    createEquipmentSchema,
    EquipmentFormValues,
    EquipmentCategories,
    EquipmentConditions
} from "@/lib/schemas/equipment"
import { equipmentService } from "@/services/equipment"
import { addressService } from "@/services/addressService"
import { Loader2 } from "lucide-react"

// --- Dynamic Fields Configuration ---
// This map defines which fields to show for each category in Step 2.
// The key matches the `category` value from the schema.
const CATEGORY_SPECS: Record<string, Array<{ key: string, label: string, type: 'text' | 'number' | 'select', options?: string[] }>> = {
    EARTHMOVING: [
        { key: "bucketCapacity", label: "Bucket Capacity (m³)", type: "number" },
        { key: "maxDiggingDepth", label: "Max Digging Depth (m)", type: "number" },
        { key: "operatingWeight", label: "Operating Weight (kg)", type: "number" },
        { key: "enginePower", label: "Engine Power (HP)", type: "number" },
    ],
    GENERATORS: [
        { key: "kva", label: "Power (kVA)", type: "number" },
        { key: "fuelTankCapacity", label: "Fuel Tank (L)", type: "number" },
        { key: "voltage", label: "Voltage (V)", type: "text" },
        { key: "phase", label: "Phase", type: "select", options: ["Single", "Three"] },
    ],
    LIFTING: [
        { key: "maxLoad", label: "Max Load Capacity (Tans)", type: "number" },
        { key: "maxHeight", label: "Max Lifting Height (m)", type: "number" },
        { key: "boomLength", label: "Boom Length (m)", type: "number" },
    ],
    TRANSPORT: [
        { key: "payloadCapacity", label: "Payload Capacity (Tons)", type: "number" },
        { key: "axles", label: "Number of Axles", type: "number" },
        { key: "transmission", label: "Transmission", type: "select", options: ["Manual", "Automatic"] },
    ],
    OTHERS: [] // Allows custom only
}

const STEPS = [
    { id: 1, title: "step1" },
    { id: 2, title: "step2" },
    { id: 3, title: "step3" },
    { id: 4, title: "step4" },
]

export function AddEquipmentWizard() {
    const t = useTranslations("dashboard.equipment")
    const schema = createEquipmentSchema((key, params) => t(key as any, params)) // Updated schema creation to match signature

    // Using a simpler t function proxy for the schema creation might need adjustment based on how t works.
    // Usually t in schema is just for string returning.
    // The previous schema implementation expected `(key: string, params?: any) => string`.
    // Validating t signature: useTranslations returns a function that accepts key and options.

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [imagePreviews, setImagePreviews] = useState<{ file: File, preview: string }[]>([])
    const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null)

    // Fetch default address on mount to handle address_id requirement
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const addresses = await addressService.getAddresses()
                if (addresses && addresses.length > 0) {
                    setDefaultAddressId(addresses[0].id)
                }
            } catch (error) {
                console.error("Failed to fetch addresses", error)
            }
        }
        fetchAddress()
    }, [])

    const form = useForm<EquipmentFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            brand: "",
            model: "",
            year: new Date().getFullYear(),
            category: "",
            condition: "GOOD",
            specifications: {},
            dailyRate: 0,
            isOperatorIncluded: false,
            images: [],
            primaryImageIndex: 0,
            city: "Riyadh", // Default
        },
        mode: "onChange"
    })

    const { watch, setValue, control, trigger } = form
    const selectedCategory = watch("category")
    const isOperatorIncluded = watch("isOperatorIncluded")

    // --- Navigation Logic ---
    const nextStep = async () => {
        let isValid = false

        // Validate fields for current step
        if (currentStep === 1) {
            isValid = await trigger(["name", "brand", "model", "year", "category", "condition"])
        } else if (currentStep === 2) {
            // Specifications are optional mixed record, usually valid unless we enforce specific ones
            isValid = true
        } else if (currentStep === 3) {
            isValid = await trigger(["dailyRate", "city", "address", "operatorCost"])
        }

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    // --- File Upload Logic ---
    const onDrop = (acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))

        const currentImages = form.getValues("images") || []

        // Append new files to form state (assuming schema allows File objects, 
        // though typically we upload then store URL. Here we simulate local file object storage for submission)
        setValue("images", [...currentImages, ...acceptedFiles])
        setImagePreviews(prev => [...prev, ...newPreviews])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxSize: 5242880 // 5MB
    })

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images")
        const currentPreviews = [...imagePreviews]

        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(currentPreviews[index].preview)

        const newImages = currentImages.filter((_, i) => i !== index)
        const newPreviews = currentPreviews.filter((_, i) => i !== index)

        setValue("images", newImages)
        setImagePreviews(newPreviews)

        // Adjust primary index if needed
        if (form.getValues("primaryImageIndex") === index) {
            setValue("primaryImageIndex", 0)
        } else if (form.getValues("primaryImageIndex") > index) {
            setValue("primaryImageIndex", form.getValues("primaryImageIndex") - 1)
        }
    }

    // --- Submission ---
    const onSubmit = async (data: EquipmentFormValues) => {
        setIsSubmitting(true)

        const submitFlow = async () => {
            // ── Step 1: Upload Files to Cloud Storage ──────────────
            let mediaItems: Array<{ file_url: string; file_type: 'IMAGE'; is_primary: boolean; display_order: number }> = [];

            if (imagePreviews.length > 0) {
                const { uploadService } = await import("@/services/upload");
                const files = imagePreviews.map(p => p.file);

                try {
                    const urls = await uploadService.uploadFiles(files, 'equipment');

                    // Build media_items array with URLs and metadata
                    mediaItems = urls.map((url, index) => ({
                        file_url: url,
                        file_type: 'IMAGE' as const,
                        is_primary: index === data.primaryImageIndex,
                        display_order: index,
                    }));
                } catch (uploadError) {
                    console.error("File upload failed:", uploadError);
                    throw new Error("Failed to upload images. Please try again.");
                }
            }

            // ── Step 2: Create Equipment with Media URLs ───────────
            const payload = {
                name: data.name,
                brand: data.brand,
                model: data.model,
                category: data.category,
                subcategory: "GENERAL",
                manufacturing_year: Number(data.year),
                fuel_type: "DIESEL" as const,
                condition: (data.condition || "GOOD") as "NEW" | "USED" | "REFURBISHED",
                price_daily: Number(data.dailyRate),
                price_monthly: Number(data.monthlyRate || 0),
                specifications: data.specifications || {},
                address_id: defaultAddressId || 1,
                with_operator: data.isOperatorIncluded,
                operator_cost: Number(data.operatorCost || 0),
                media_items: mediaItems, // Include uploaded file URLs
                sector_ids: [1], // Default to Construction sector
            }

            // Create equipment with media in a single request
            const response = await equipmentService.create(payload)

            return response
        }

        toast.promise(submitFlow(), {
            loading: t("wizard.submitting"),
            success: () => {
                router.push("/dashboard/fleet")
                return t("wizard.submitSuccess")
            },
            error: (err: Error) => {
                console.error("Equipment submission failed:", err)
                return err.message || t("wizard.submitError")
            },
            finally: () => {
                setIsSubmitting(false)
            },
        })
    }

    // --- Animation Variants ---
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header & Progress */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{t("wizard.title")}</h1>
                <p className="text-muted-foreground mb-6">{t("wizard.subtitle")}</p>

                <div className="relative">
                    <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
                        {STEPS.map((step) => (
                            <span key={step.id} className={currentStep >= step.id ? "text-matin-primary font-bold" : ""}>
                                {t(`wizard.${step.title}` as any)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl rounded-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait" custom={1}>
                                <motion.div
                                    key={currentStep}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    {/* --- STEP 1: BASIC DETAILS --- */}
                                    {currentStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField control={control} name="name" render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>{t("fields.name")}</FormLabel>
                                                    <FormControl><Input placeholder="e.g. Caterpillar D8T Dozer" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={control} name="category" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("fields.category")}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {EquipmentCategories.map(cat => (
                                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={control} name="condition" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("fields.condition")}</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Condition" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {EquipmentConditions.map(c => (
                                                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={control} name="brand" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("fields.brand")}</FormLabel>
                                                    <FormControl><Input placeholder="e.g. Caterpillar" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={control} name="model" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("fields.model")}</FormLabel>
                                                    <FormControl><Input placeholder="e.g. D8T" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={control} name="year" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t("fields.year")}</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    )}

                                    {/* --- STEP 2: DYNAMIC SPECIFICATIONS --- */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-700 text-sm">
                                                <div className="mt-0.5"><Plus className="w-4 h-4" /></div>
                                                <p>{t("wizard.subtitle")}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Predefined Fields based on Category */}
                                                {selectedCategory && CATEGORY_SPECS[selectedCategory]?.map((spec) => (
                                                    <FormItem key={spec.key}>
                                                        <FormLabel>{spec.label}</FormLabel>
                                                        <FormControl>
                                                            {spec.type === 'select' ? (
                                                                <Select
                                                                    onValueChange={(val) => setValue(`specifications.${spec.key}`, val)}
                                                                    defaultValue={watch(`specifications.${spec.key}`)}
                                                                >
                                                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {spec.options?.map(opt => (
                                                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Input
                                                                    type={spec.type}
                                                                    onChange={(e) => setValue(`specifications.${spec.key}`, e.target.value)}
                                                                    defaultValue={watch(`specifications.${spec.key}`)}
                                                                    placeholder={spec.label}
                                                                />
                                                            )}
                                                        </FormControl>
                                                    </FormItem>
                                                ))}

                                                {/* Fallback if no category selected or empty */}
                                                {!selectedCategory && (
                                                    <div className="col-span-2 text-center py-10 text-gray-400">
                                                        Please select a category in Step 1 to see relevant specifications.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Custom Specs Adder (Simple implementation) */}
                                            <div className="pt-4 border-t">
                                                <h4 className="font-semibold text-sm mb-4">{t("fields.addSpec")}</h4>
                                                <div className="flex gap-3">
                                                    <Input id="customKey" placeholder={t("fields.key")} className="flex-1" />
                                                    <Input id="customValue" placeholder={t("fields.value")} className="flex-1" />
                                                    <Button type="button" variant="outline" onClick={() => {
                                                        const keyInput = document.getElementById('customKey') as HTMLInputElement
                                                        const valInput = document.getElementById('customValue') as HTMLInputElement
                                                        if (keyInput.value && valInput.value) {
                                                            setValue(`specifications.${keyInput.value}`, valInput.value)
                                                            keyInput.value = ""
                                                            valInput.value = ""
                                                            toast.success("Spec added")
                                                        }
                                                    }}>
                                                        <Plus size={16} />
                                                    </Button>
                                                </div>

                                                {/* Display Added Custom Specs */}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {Object.entries(watch("specifications") || {}).map(([key, value]) => {
                                                        // Filter out pre-defined keys to avoid duplication in display if needed, 
                                                        // or just show everything as 'tags'
                                                        return (
                                                            <Badge key={key} variant="secondary" className="px-3 py-1 gap-2 text-sm">
                                                                <span className="font-semibold">{key}:</span> {String(value)}
                                                                <div
                                                                    className="cursor-pointer hover:text-red-500 ms-1"
                                                                    onClick={() => {
                                                                        const specs = { ...watch("specifications") }
                                                                        delete specs[key]
                                                                        setValue("specifications", specs)
                                                                    }}
                                                                >
                                                                    <X size={12} />
                                                                </div>
                                                            </Badge>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- STEP 3: PRICING & LOCATION --- */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField control={control} name="dailyRate" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("fields.dailyPrice")}</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type="number" {...field} className="ps-12" />
                                                                <span className="absolute start-3 top-2.5 text-gray-500 font-bold text-sm">SAR</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />

                                                <FormField control={control} name="monthlyRate" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("fields.monthlyPrice")}</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type="number" {...field} className="ps-12" />
                                                                <span className="absolute start-3 top-2.5 text-gray-500 font-bold text-sm">SAR</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800/50">
                                                <FormField control={control} name="isOperatorIncluded" render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>{t("fields.operator")}</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )} />

                                                {isOperatorIncluded && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                                                        <FormField control={control} name="operatorCost" render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>{t("fields.operatorCost")}</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" {...field} placeholder="0 if included in base price" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField control={control} name="city" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("fields.city")}</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Riyadh">Riyadh</SelectItem>
                                                                <SelectItem value="Jeddah">Jeddah</SelectItem>
                                                                <SelectItem value="Dammam">Dammam</SelectItem>
                                                                <SelectItem value="Neom">Neom</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />

                                                <FormField control={control} name="address" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t("fields.address")}</FormLabel>
                                                        <FormControl><Input placeholder="Street, District..." {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>
                                    )}

                                    {/* --- STEP 4: MEDIA --- */}
                                    {currentStep === 4 && (
                                        <div className="space-y-6">
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragActive ? 'border-matin-primary bg-matin-primary/5' : 'border-gray-300 hover:border-matin-primary/50'}`}
                                            >
                                                <input {...getInputProps()} />
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-500">
                                                    <UploadCloud size={32} />
                                                </div>
                                                <p className="text-lg font-semibold text-gray-700">{t("upload.dragDrop")}</p>
                                                <p className="text-sm text-gray-400 mt-1">{t("upload.maxSize")}</p>
                                                <FormMessage>{form.formState.errors.images?.message}</FormMessage>
                                            </div>

                                            {/* Preview Grid */}
                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                    {imagePreviews.map((img, index) => (
                                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                                                            <img src={img.preview} alt="preview" className="w-full h-full object-cover" />

                                                            {/* Actions Overlay */}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={watch("primaryImageIndex") === index ? "default" : "secondary"}
                                                                    className={watch("primaryImageIndex") === index ? "bg-matin-primary text-white" : "bg-white/90"}
                                                                    onClick={() => setValue("primaryImageIndex", index)}
                                                                >
                                                                    {watch("primaryImageIndex") === index ? <Check size={14} className="me-1" /> : null}
                                                                    {t("upload.primary")}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="icon"
                                                                    variant="destructive"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() => removeImage(index)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>

                                                            {/* Primary Badge */}
                                                            {watch("primaryImageIndex") === index && (
                                                                <div className="absolute top-2 start-2 bg-matin-primary text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
                                                                    Primary
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer Navigation */}
                        <div className="flex justify-between pt-6 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="w-32"
                            >
                                <ChevronLeft className="me-2 h-4 w-4 rtl:rotate-180" /> {t("wizard.prev")}
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-32 bg-matin-primary hover:bg-matin-primary/90"
                                >
                                    {t("wizard.next")} <ChevronRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-40 bg-green-600 hover:bg-green-700 text-white"
                                    disabled={imagePreviews.length === 0 || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                            {t("wizard.submitting")}
                                        </>
                                    ) : (
                                        <>
                                            {t("wizard.submit")} <Check className="ms-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
