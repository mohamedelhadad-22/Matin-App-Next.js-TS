export interface AdminStats {
    totalUsers: number;
    activeDisputes: number;
    pendingVerifications: number;
    revenue: number;
    newRegistrations: {
        date: string;
        count: number;
    }[];
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'SUPPLIER' | 'BUYER' | 'COMPANY' | 'INDIVIDUAL';
    entityType: 'COMPANY' | 'INDIVIDUAL';
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED';
    status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
    joinedAt: string;
}

export interface AdminUserDocument {
    id: string;
    type: 'CR' | 'TAX' | 'ID' | 'OTHER';
    url: string;
    mimeType: string;
    name: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface AdminUserDetails extends AdminUser {
    phone: string;
    address?: string;
    companyName?: string;
    crNumber?: string;
    vatNumber?: string;
    documents: AdminUserDocument[];
    stats: {
        totalOrders: number;
        totalRevenue: number;
        rating: number;
    };
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type DisputeStatus = 'OPEN' | 'RESOLVED' | 'ESCALATED';

export interface AdminDispute {
    id: string;
    orderId: string;
    complainantId: string;
    complainantName: string;
    respondentId: string;
    respondentName: string;
    reason: string;
    description: string;
    status: DisputeStatus;
    createdAt: string;
    resolvedAt?: string;
}

export interface GetDisputesParams {
    page?: number;
    limit?: number;
    status?: DisputeStatus | 'ALL';
    search?: string;
}

export type DisputeDecision = 'REFUND_TENANT' | 'RELEASE_VENDOR' | 'PARTIAL_REFUND';
