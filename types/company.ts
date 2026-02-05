export interface CompanyProfile {
    id: string;
    name: string;
    cr_number: string;
    vat_number?: string;
    address: Address;
    logoUrl?: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    email: string;
    phone?: string;
}

export interface UpdateCompanyDto {
    name?: string;
    vatNumber?: string;
    address?: Address;
    cr_number?: string;
    status?: string;
    email?: string;
    phone?: string;
}

export interface Address {
    id: string;
    company_id: string;
    complete_address: string;
    addres_title?: string;
    city?: string;
    country?: string;
    province?: string;
    district?: string;
    street_one?: string;
    street_two?: string;
    national_address?: string;
    building_number?: string;
    postal_code?: string;
    is_default?: boolean;
    latitude: number;
    longitude: number;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
}