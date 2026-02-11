import { apiClient } from "@/lib/api-client";
import { CompanyProfile, CreateCompanyDto } from "@/types/company";

export const companyService = {
    getProfile: async () => {
        return apiClient<CompanyProfile>('/companies/me');
    },

    updateProfile: async (data: FormData | any) => {
        return apiClient<CompanyProfile>('/companies/me', {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    },

    // Create Company Endpoint
    createCompany: async (data: CreateCompanyDto) => {
        return apiClient<CompanyProfile>('/companies/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};