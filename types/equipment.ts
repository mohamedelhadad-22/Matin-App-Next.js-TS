// Enums
export type EquipmentStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RESERVED';
export type FuelType = 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'HYBRID';
export type EquipmentCondition = 'NEW' | 'USED' | 'REFURBISHED';

// "Uses JSONB for flexible specs"
export interface EquipmentSpecifications {
    [key: string]: string | number | boolean;
    // bucket_capacity?: string;
    // max_digging_depth?: string;
    // operating_weight?: string;
}

// Response includes id, name, status, owner_id
export interface Equipment {
    id: number;
    owner_id: number;
    name: string;
    status: EquipmentStatus;

    // category
    category: string;
    subcategory: string;
    brand: string;
    model: string;
    manufacturing_year: number;

    // fuel type and condition
    fuel_type: FuelType;
    condition: EquipmentCondition;

    // prices
    price_daily: number;
    price_monthly: number;

    // operation details
    address_id: number;
    with_operator: boolean;
    operator_cost?: number;

    // specifications
    specifications: EquipmentSpecifications;

    // Upload endpoint exists, implies we can fetch them
    primary_image_url?: string;
    images?: string[];

    created_at?: string;
    updated_at?: string;
}

// Request Body (Payload)
export interface CreateEquipmentDto {
    name: string;
    category: string;
    subcategory: string;
    brand: string;
    model: string;
    manufacturing_year: number;
    fuel_type: FuelType;
    condition: EquipmentCondition;

    price_daily: number;
    price_monthly: number;

    // JSONB
    specifications: EquipmentSpecifications;

    address_id: number;
    with_operator: boolean;
    operator_cost?: number;
}

// Update Equipment (Payload)
export interface UpdateEquipmentDto extends Partial<CreateEquipmentDto> {
    status?: EquipmentStatus;
}