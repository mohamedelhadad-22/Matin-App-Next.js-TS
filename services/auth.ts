import Cookies from 'js-cookie';
import { apiClient } from "@/lib/api-client";
import { AuthResponse } from "@/types/auth";
import { RegisterWizardValues } from "@/lib/schemas/auth";

export const authService = {
    login: async (data: { email: string; password: string }) => {
        const response = await apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response?.access_token) {
            // Token MUST be in Cookies — this is what Middleware reads
            // Setting path: '/' is CRITICAL to ensure the cookie is available across all routes
            Cookies.set('token', response.access_token, {
                expires: 7,       // 7 days
                secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
                sameSite: 'lax',
                path: '/',
            });

            // Role MUST be in Cookies for Middleware to redirect correctly
            Cookies.set('user_role', response.user_role, {
                expires: 7,
                secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
                sameSite: 'lax',
                path: '/',
            });

            if (response.refresh_token) {
                Cookies.set('refresh_token', response.refresh_token, {
                    expires: 7,
                    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
                    sameSite: 'lax',
                    path: '/',
                });
            }

            // Keep user_data in localStorage for UI rendering only (optional)
            if (typeof window !== 'undefined') {
                localStorage.setItem('user_data', JSON.stringify(response));
            }
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
                try {
                    return JSON.parse(storedUser);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },

    /** Returns the token from cookies */
    getToken: (): string | undefined => {
        return Cookies.get('token');
    },

    /** Nuclear logout: clears cookies, localStorage, and forces full page reload */
    logout: () => {
        // 1. Remove auth cookies (using path: '/' to ensure they are removed)
        Cookies.remove('token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        Cookies.remove('user_role', { path: '/' });

        // 2. Clear all localStorage
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }

        // 3. Force full page reload to clear all in-memory state
        // Using window.location.href (NOT router.push) to ensure complete reset
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
    }
};
