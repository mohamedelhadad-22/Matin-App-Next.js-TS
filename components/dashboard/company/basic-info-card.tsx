"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Save, X, Building2, Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { companyService } from "@/services/companyService"
import { CompanyProfile } from "@/types/company"
import { Skeleton } from "@/components/ui/skeleton"

export function BasicInfoCard() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [data, setData] = useState<CompanyProfile | null>(null)

    // 1. for logo upload
    const fileInputRef = useRef<HTMLInputElement>(null) // referance for hidden logo input
    const [selectedFile, setSelectedFile] = useState<File | null>(null) // selected logo file
    const [logoPreview, setLogoPreview] = useState<string | null>(null) // preview logo url

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const profile = await companyService.getProfile();
                setData(profile);
            } catch (error) {
                console.error(error);
                toast.error("فشل تحميل بيانات الشركة");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. function to handle logo selection
    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // check file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
                return;
            }

            setSelectedFile(file);
            // عمل رابط وهمي لعرض الصورة فوراً (Preview)
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    // function to open hidden logo input
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // 3. function to save data (FormData)
    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        const formData = new FormData(event.currentTarget);

        // preparing the FormData to send
        const submitData = new FormData();
        submitData.append('name', formData.get('name') as string);
        submitData.append('vat_number', formData.get('vatNumber') as string);
        // address not sent here as we agreed

        // adding the logo if changed
        if (selectedFile) {
            submitData.append('logo', selectedFile); // make sure the backend is waiting for a key named 'logo'
        }

        try {
            const updatedProfile = await companyService.updateProfile(submitData);
            setData(updatedProfile);
            setIsEditing(false);
            setSelectedFile(null); // reset selected file
            toast.success("تم تحديث الملف واللوجو بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4"><Skeleton className="h-20 w-20 rounded-full" /></div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-10" /><Skeleton className="h-10" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Default empty state if no data
    const profileData = data || { name: '', cr_number: '', vat_number: '', address: null, logoUrl: null } as unknown as CompanyProfile;

    // determining the displayed logo (priority for new preview, then original logo, then placeholder)
    const displayLogo = logoPreview || profileData.logoUrl || "/placeholder-logo.png";

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-matin-primary" />
                    البيانات الأساسية
                </CardTitle>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setLogoPreview(null); // cancel preview when editing
                        setSelectedFile(null);
                    }}
                    disabled={isSaving}
                    className={isEditing ? "text-red-500 hover:bg-red-50" : "text-gray-500"}
                >
                    {isEditing ? <><X className="w-4 h-4 ml-1" /> إلغاء</> : <><Pencil className="w-4 h-4 ml-1" /> تعديل</>}
                </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
                <form onSubmit={handleSave}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-2 border-gray-100 shadow-sm">
                                <AvatarImage src={displayLogo} className="object-cover" />
                                <AvatarFallback className="bg-matin-primary/10 text-matin-primary text-3xl font-bold">
                                    {profileData.name ? profileData.name.charAt(0) : 'م'}
                                </AvatarFallback>
                            </Avatar>

                            {/* Overlay in case of editing only */}
                            {isEditing && (
                                <div
                                    onClick={triggerFileInput}
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Upload className="text-white w-6 h-6" />
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex flex-col gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                                    تغيير الشعار
                                </Button>
                                <p className="text-[10px] text-muted-foreground">JPG, PNG بحد أقصى 2MB</p>

                                {/* hidden input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoChange}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field name="name" label="اسم المنشأة" value={profileData.name} isEditing={isEditing} required />
                        <Field name="crNumber" label="رقم السجل التجاري" value={profileData.cr_number} isEditing={false} />
                        <Field name="vatNumber" label="الرقم الضريبي" value={profileData.vat_number || '-'} isEditing={isEditing} />

                        {/* address for display only */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">العنوان الرئيسي</Label>
                            <div className="font-medium text-sm text-gray-900 border-b border-transparent py-1.5 px-1 min-h-[32px] flex items-center justify-between">
                                {profileData.address?.city || 'غير محدد'}
                                {!isEditing && <span className="text-xs text-blue-600 cursor-pointer opacity-70 hover:opacity-100">إدارة العناوين</span>}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4 border-t mt-4">
                            <Button type="submit" disabled={isSaving} className="bg-matin-primary hover:bg-matin-primary/90 gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                حفظ التغييرات
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}

function Field({ label, value, isEditing, name, required }: any) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            {isEditing ? (
                <Input name={name} defaultValue={value} className="h-9" required={required} disabled={!isEditing && name === 'crNumber'} />
            ) : (
                <div className="font-medium text-sm text-gray-900 border-b border-transparent py-1.5 px-1 min-h-[32px]">
                    {value || '-'}
                </div>
            )}
        </div>
    )
}