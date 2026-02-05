import { CompanyProfile, UpdateCompanyDto } from "@/types/company";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const companyService = {
    // 1. Get Profile
    getProfile: async (): Promise<CompanyProfile> => {
        // In a real app, you'd attach the Bearer Token here
        const response = await fetch(`${API_URL}/company/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` 
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch company profile');
        }

        return response.json();
    },

    // 2. Update Profile
    updateProfile: async (data: UpdateCompanyDto): Promise<CompanyProfile> => {
        const response = await fetch(`${API_URL}/company/profile`, {
            method: 'PUT', // or PATCH
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    }
};