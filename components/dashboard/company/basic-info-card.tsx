"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Save, X, Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BasicInfoCard() {
    // 1. state of edits (View Mode vs Edit Mode)
    const [isEditing, setIsEditing] = useState(false)

    // dummy data (temporary until we connect to the backend)
    const [data, setData] = useState({
        name: "شركة البناء الحديث للمقاولات",
        crNumber: "1010101010",
        vatNumber: "300300300300003",
        address: "الرياض، حي العليا",
        email: "info@modernbuild.sa"
    })

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-matin-primary" />
                    بيانات الشركة
                </CardTitle>

                {/* switch between view and edit mode */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-gray-500"}
                >
                    {isEditing ? <><X className="w-4 h-4 ml-1" /> إلغاء</> : <><Pencil className="w-4 h-4 ml-1" /> تعديل</>}
                </Button>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-2 border-gray-100 shadow-sm">
                        <AvatarImage src="/placeholder-logo.png" />
                        <AvatarFallback className="bg-matin-primary/10 text-matin-primary text-2xl font-bold">م</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <Button variant="outline" size="sm">تغيير الشعار</Button>
                    )}
                </div>

                {/* Fields Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* here we made a small function to avoid code repetition */}
                    <Field label="اسم المنشأة" value={data.name} isEditing={isEditing} />
                    <Field label="رقم السجل التجاري" value={data.crNumber} isEditing={isEditing} />
                    <Field label="الرقم الضريبي" value={data.vatNumber} isEditing={isEditing} />
                    <Field label="العنوان الوطني" value={data.address} isEditing={isEditing} />
                </div>

                {/* Save Button (appears only when editing) */}
                {isEditing && (
                    <div className="flex justify-end pt-4 border-t">
                        <Button className="bg-matin-primary hover:bg-matin-primary/90 gap-2">
                            <Save className="w-4 h-4" /> حفظ التغييرات
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Small Helper Component within the same file to keep code clean
// this is a small helper component to display (text) or (input) depending on the state 
function Field({ label, value, isEditing }: { label: string, value: string, isEditing: boolean }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            {isEditing ? (
                <Input defaultValue={value} className="h-9" />
            ) : (
                <div className="font-medium text-sm text-gray-900 border-b border-transparent py-1.5 px-1">
                    {value}
                </div>
            )}
        </div>
    )
}