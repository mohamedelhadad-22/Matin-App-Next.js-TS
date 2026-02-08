import { apiClient } from "@/lib/api-client";
import { Address } from "@/types/company";

export const addressService = {

    getAddresses: async () => {
        // لاحظ استخدام الـ Generic <Address[]> عشان نعرف التايب سكريبت الداتا راجعة إزاي
        return apiClient<Address[]>('/company/addresses');
    },

    setDefault: async (id: string) => {
        return apiClient<void>(`/company/addresses/${id}/default`, {
            method: 'PATCH',
        });
    },

    deleteAddress: async (id: string) => {
        return apiClient<void>(`/company/addresses/${id}`, {
            method: 'DELETE',
        });
    }
};