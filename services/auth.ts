import { apiClient } from "@/lib/api-client";
import { AuthResponse } from "@/types/auth";
import { RegisterWizardValues } from "@/lib/schemas/auth";

export const authService = {
    login: async (data: { email: string; password: string }) => {
        const response = await apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response?.access_token && typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
            if (response.refresh_token) localStorage.setItem('refresh_token', response.refresh_token);
            localStorage.setItem('user_data', JSON.stringify(response));
        }
        return response;
    },

    register: async (data: RegisterWizardValues) => {
        const payload = {
            email: data.email,
            username: data.email,
            password: data.password,
            full_name: data.full_name,
            phone: data.phone,
            entity_type: data.accountType,
            ...(data.accountType === 'COMPANY' && {
                company_name: data.company_name,
                cr_number: data.registration_number,
                vat_number: data.vat_number,
                role: 'SUPPLIER'
            })
        };

        return apiClient('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getCurrentUser: async () => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user_data');
            if (storedUser) {
                return JSON.parse(storedUser);
            }
        }
        return null;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
        }
    }
};