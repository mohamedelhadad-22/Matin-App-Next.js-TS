import { Address } from "@/types/company";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const addressService = {
    // get all company addresses
    getAddresses: async (): Promise<Address[]> => {
        const response = await fetch(`${API_URL}/company/addresses`, {
            // headers: { Authorization: `Bearer ...` }
        });
        if (!response.ok) throw new Error('Failed to fetch addresses');
        return response.json();
    },

    // set default address
    setDefault: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/company/addresses/${id}/default`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('Failed to set default address');
    },

    // delete address
    deleteAddress: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/company/addresses/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete address');
    }
};