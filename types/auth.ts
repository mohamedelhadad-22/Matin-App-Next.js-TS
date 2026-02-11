// Enums from Module 1
export type EntityType = 'INDIVIDUAL' | 'COMPANY';
export type UserRole = 'ADMIN' | 'MANAGER' | 'ENGINEER' | 'SUPPLIER' | 'CUSTOMER';
export type PlanType = 'FREE' | 'PREMIUM' | 'ENTERPRISE';

// Login Response
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id: number;
    user_role: UserRole;
    entity_type: EntityType;
    username: string;
    full_name: string;
    is_verified: boolean;
    plan_type: PlanType;
    verification_status: string; // 'VERIFIED' | 'PENDING'
}

// User Profile (Minimal)
export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    role: UserRole;
    entity_type: EntityType;
    plan_type: PlanType;
    verification_status: string;
    company_name?: string;
    cr_number?: string;
    vat_number?: string;

}