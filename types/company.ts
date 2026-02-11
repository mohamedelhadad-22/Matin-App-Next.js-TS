// import { VerificationStatus } from "./auth"; // ممكن نعمل ملف common.ts للحاجات المشتركة

// Create Company Payload
export interface CreateCompanyDto {
    name: string;
    cr_number: string;
    vat_number: string;
    industry: string;
    employee_count: number;
    address: string;
    city: string;
    country_code: string;
    is_approval_required: boolean;
}

// Company Profile Response
export interface CompanyProfile {
    id: number;
    name: string;
    verification_status: string;
    owner_id: number;
    created_at: string;
    trust_score?: number;
    trust_tier?: string;
}

// Employee Invitation
export interface InviteEmployeeDto {
    email: string;
    full_name: string;
    role_in_company: string;
}