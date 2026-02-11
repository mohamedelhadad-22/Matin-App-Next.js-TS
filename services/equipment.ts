import { apiClient } from "@/lib/api-client";
import { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from "@/types/equipment";

// ─── Equipment Service ─────────────────────────────────────────────
// All methods communicate with the real Backend API.
// ────────────────────────────────────────────────────────────────────

export const equipmentService = {
    // ── Read ────────────────────────────────────────────────────────

    /** Get all equipment (public / marketplace) */
    getAll: async (params?: Record<string, string>) => {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient<Equipment[]>(`/equipment${query}`);
    },

    /** Get the logged-in vendor's fleet */
    getMyFleet: async (params?: Record<string, string>) => {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient<Equipment[]>(`/equipment/my/listings${query}`);
    },

    /** Get single equipment by ID */
    getById: async (id: string | number) => {
        return apiClient<Equipment>(`/equipment/${id}`);
    },

    // ── Write ───────────────────────────────────────────────────────

    /** 
     * Create new equipment with media items inline.
     * Media files are uploaded to cloud storage first, then URLs are included in the payload.
     */
    create: async (data: CreateEquipmentDto) => {
        return apiClient<Equipment>("/equipment/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    /** Update existing equipment */
    update: async (id: string | number, data: UpdateEquipmentDto) => {
        return apiClient<Equipment>(`/equipment/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    /** Delete equipment */
    delete: async (id: string | number) => {
        return apiClient<void>(`/equipment/${id}`, {
            method: "DELETE",
        });
    },
};
