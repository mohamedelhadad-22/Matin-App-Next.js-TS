
// 1. Sectors
export type EquipmentSector =
    | "Construction"
    | "Industrial"
    | "Agricultural"
    | "Transportation"
    | "Mining"
    | "Oil & Gas"
    | "Marine"
    | "Other";

// 2. Categories
export type EquipmentCategory =
    | "Heavy Machinery"
    | "Earthmovers"
    | "Loaders"
    | "Generators"
    | "Cranes";

// 3. Status
export type EquipmentStatus = "available" | "rented" | "maintenance";

// 4. Equipment
export interface Equipment {
    id: string | number;
    name: string;
    description?: string;
    status: EquipmentStatus;
    category: EquipmentCategory;
    sectors: EquipmentSector[];
    // media
    media: string[];

    // price
    dailyRate: number;
    monthlyRate?: number;
    yearlyRate?: number;
    price?: number;

    // Technical specifications
    brand: string;
    model: string;
    manufacturingYear: number;
    powerCapacity?: string;
    fuelType?: string;
    meterReading?: number;

    // with operator
    withOperator: boolean;
    operatorCost?: number;

    // Address
    location: string;
    coordinates?: { lat: number; lng: number };
    latitude: number,
    longitude: number,

    // Owner
    ownerId: number;

    // Dates
    createdAt: string;
    updatedAt: string;

    // rent frequency
    frequencyRent: string
}