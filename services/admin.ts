import { apiClient } from '@/lib/api-client';
import { AdminDispute, AdminStats, AdminUser, AdminUserDetails, DisputeDecision, GetDisputesParams, GetUsersParams, PaginatedResponse } from '@/types/admin';

export const adminService = {
    getStats: async (): Promise<AdminStats> => {
        return apiClient<AdminStats>('/admin/stats');
    },

    getUsers: async (params: GetUsersParams = {}): Promise<PaginatedResponse<AdminUser>> => {
        const query = new URLSearchParams();

        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.role && params.role !== 'ALL') query.append('role', params.role);
        if (params.status && params.status !== 'ALL') query.append('status', params.status);

        return apiClient<PaginatedResponse<AdminUser>>(`/admin/users?${query.toString()}`);
    },

    verifyUser: async (userId: string) => {
        return apiClient(`/admin/users/${userId}/verify-kyc`, {
            method: 'POST',
        });
    },

    banUser: async (userId: string) => {
        return apiClient(`/admin/users/${userId}/ban`, {
            method: 'POST',
        });
    },

    activateUser: async (userId: string) => {
        return apiClient(`/admin/users/${userId}/activate`, {
            method: 'POST',
        });
    },

    getUserDetails: async (userId: string): Promise<AdminUserDetails> => {
        return apiClient<AdminUserDetails>(`/admin/users/${userId}`);
    },

    getDisputes: async (params: GetDisputesParams = {}): Promise<PaginatedResponse<AdminDispute>> => {
        const query = new URLSearchParams();

        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.status && params.status !== 'ALL') query.append('status', params.status);
        if (params.search) query.append('search', params.search);

        return apiClient<PaginatedResponse<AdminDispute>>(`/admin/disputes?${query.toString()}`);
    },

    resolveDispute: async (disputeId: string, decision: DisputeDecision) => {
        return apiClient(`/admin/disputes/${disputeId}/resolve`, {
            method: 'POST',
            body: JSON.stringify({ decision }),
        });
    }
};
