"use client"

import { MapPin, MoreVertical, Star, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Address } from "@/types/company"

interface AddressCardProps {
    address: Address
    onSetDefault: (id: string) => void
    onDelete: (id: string) => void
    onEdit: (address: Address) => void
    isProcessing: boolean
}

export function AddressCard({ address, onSetDefault, onDelete, onEdit, isProcessing }: AddressCardProps) {
    return (
        <Card className={`p-4 relative group transition-all duration-300 ${address.is_default ? 'border-matin-primary bg-matin-primary/5' : 'hover:border-gray-300'}`}>

            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    {/* Icon Box */}
                    <div className={`p-2.5 rounded-lg shrink-0 ${address.is_default ? 'bg-matin-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <MapPin className="w-5 h-5" />
                    </div>

                    {/* Address Details */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900">{address.addres_title}</h4>
                            {address.is_default && (
                                <Badge variant="default" className="text-[10px] h-5 px-1.5">الرئيسي</Badge>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            {address.city}، {address.district}
                        </p>
                        <p className="text-xs text-gray-400">
                            {address.street_one} {address.building_number ? `- مبنى ${address.building_number}` : ''}
                        </p>
                    </div>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" disabled={isProcessing}>
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(address)}>
                            <Pencil className="w-4 h-4 ml-2" /> تعديل
                        </DropdownMenuItem>

                        {!address.is_default && (
                            <DropdownMenuItem onClick={() => onSetDefault(address.id)}>
                                <Star className="w-4 h-4 ml-2" /> تعيين كافتراضي
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                            onClick={() => onDelete(address.id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 ml-2" /> حذف
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    )
}