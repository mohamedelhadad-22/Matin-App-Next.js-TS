// Request a Quote (RFQ)
export interface CreateQuoteDto {
    equipment_id: number;
    start_date: string; // ISO Date
    end_date: string;
    rental_period: string;
    quantity: number;
    delivery_required: boolean;
    delivery_address: string;
    mobilization_responsibility: string;
    fuel_included: boolean;
    payment_term: string
}