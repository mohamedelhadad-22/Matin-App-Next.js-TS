"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Save, X, Building2, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { companyService } from "@/services/companyService"
import { CompanyProfile, UpdateCompanyDto } from "@/types/company"
import { Skeleton } from "@/components/ui/skeleton"

export function BasicInfoCard() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [data, setData] = useState<CompanyProfile | null>(null)

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

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);

        const formData = new FormData(event.currentTarget);

        const updates: UpdateCompanyDto = {
            name: formData.get('name') as string,
            vatNumber: formData.get('vatNumber') as string,
        };

        try {
            const updatedProfile = await companyService.updateProfile(updates);
            setData(updatedProfile);
            setIsEditing(false);
            toast.success("تم تحديث البيانات الأساسية بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4"><Skeleton className="h-20 w-20 rounded-full" /></div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-10" /><Skeleton className="h-10" />
                        <Skeleton className="h-10" /><Skeleton className="h-10" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!data) return null;

    // 💡 Helper to display address string safely
    // بنجمع العنوان للعرض فقط
    const displayAddress = data.address
        ? `${data.address.city || ''} - ${data.address.district || ''}`
        : 'لا يوجد عنوان مسجل';

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-matin-primary" />
                    البيانات الأساسية
                </CardTitle>

                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isSaving} className={isEditing ? "text-red-500 hover:bg-red-50" : "text-gray-500"}>
                    {isEditing ? <><X className="w-4 h-4 ml-1" /> إلغاء</> : <><Pencil className="w-4 h-4 ml-1" /> تعديل</>}
                </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
                <form onSubmit={handleSave}>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-20 h-20 border-2 border-gray-100 shadow-sm">
                            <AvatarImage src={data.logoUrl || "/placeholder-logo.png"} />
                            <AvatarFallback className="bg-matin-primary/10 text-matin-primary text-2xl font-bold">
                                {data.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <Button type="button" variant="outline" size="sm">تغيير الشعار</Button>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field name="name" label="اسم المنشأة" value={data.name} isEditing={isEditing} required />
                        <Field name="crNumber" label="رقم السجل التجاري" value={data.cr_number} isEditing={false} />
                        <Field name="vatNumber" label="الرقم الضريبي" value={data.vat_number || '-'} isEditing={isEditing} />

                        {/* here is the address readonly  */}
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">العنوان الرئيسي</Label>
                            <div className="font-medium text-sm text-gray-900 border-b border-transparent py-1.5 px-1 min-h-[32px] flex items-center justify-between">
                                {displayAddress}
                                {!isEditing && <span className="text-xs text-blue-600 cursor-pointer">عرض الخريطة</span>}
                            </div>
                            {isEditing && <p className="text-[10px] text-orange-500">لتعديل العنوان، يرجى استخدام قسم إدارة العناوين.</p>}
                        </div>

                    </div>

                    {isEditing && (
                        <div className="flex justify-end pt-4 border-t mt-4">
                            <Button type="submit" disabled={isSaving} className="bg-matin-primary hover:bg-matin-primary/90 gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                حفظ التغييرات الأساسية
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
                    {value}
                </div>
            )}
        </div>
    )
}