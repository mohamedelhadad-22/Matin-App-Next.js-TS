import { apiClient } from "@/lib/api-client";
import { CompanyProfile } from "@/types/company";

export const companyService = {
    getProfile: async () => {
        return apiClient<CompanyProfile>('/company/profile');
    },

    // the data is FormData 
    updateProfile: async (data: FormData | any) => {
        return apiClient<CompanyProfile>('/company/profile', {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }
};