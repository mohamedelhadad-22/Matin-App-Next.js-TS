"use client"

import { useEffect, useState } from "react"
import { Plus, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressCard } from "./address-card"
import { Address } from "@/types/company"
import { addressService } from "@/services/addressService"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressModal } from "./address-modal"

export function AddressList() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    // Fetch Addresses
    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses()
            setAddresses(data)
        } catch (error) {
            toast.error("فشل تحميل العناوين")
        } finally {
            setIsLoading(false)
        }
    }
    // open modal too add new address
    const handleAdd = () => {
        setEditingAddress(null)
        setIsModalOpen(true)
    }
    // open modal too edit address
    const handleEdit = (address: Address) => {
        setEditingAddress(address)
        setIsModalOpen(true)
    }

    // close modal
    const handleSuccess = () => {
        loadAddresses() // Refresh List
    }
    useEffect(() => {
        loadAddresses()
    }, [])

    // Actions Handlers
    const handleSetDefault = async (id: string) => {
        setProcessingId(id)
        try {
            await addressService.setDefault(id)
            // Optimistic Update: update the UI immediately to provide a better user experience
            setAddresses(prev => prev.map(addr => ({
                ...addr,
                is_default: addr.id === id // only the one that matches the ID will be true, the rest will be false
            })))
            toast.success("تم تغيير العنوان الرئيسي")
        } catch (error) {
            toast.error("حدث خطأ")
        } finally {
            setProcessingId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) return;

        setProcessingId(id)
        try {
            await addressService.deleteAddress(id)
            setAddresses(prev => prev.filter(addr => addr.id !== id))
            toast.success("تم حذف العنوان")
        } catch (error) {
            toast.error("لا يمكن حذف العنوان")
        } finally {
            setProcessingId(null)
        }
    }

    if (isLoading) return <AddressListSkeleton />

    return (
        <div className="space-y-4">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Map className="w-5 h-5 text-matin-primary" />
                    العناوين والفروع
                    <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                        {addresses.length} عنوان
                    </span>
                </h3>
                <Button onClick={handleAdd} size="sm" variant="outline" className="gap-2 border-dashed border-gray-300 hover:border-matin-primary hover:text-matin-primary">
                    <Plus className="w-4 h-4" /> إضافة فرع جديد
                </Button>
            </div>

            {/* List Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {addresses.map(addr => (
                    <AddressCard
                        key={addr.id}
                        address={addr}
                        onSetDefault={handleSetDefault}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isProcessing={processingId === addr.id}
                    />
                ))}
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                addressToEdit={editingAddress}
            />
        </div>
    )
}

// Skeleton Component to show loading state
function AddressListSkeleton() {
    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>
        </div>
    )
}