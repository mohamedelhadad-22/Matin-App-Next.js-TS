import { apiClient } from "@/lib/api-client";

export interface UploadResponse {
    url: string;
    filename: string;
}

/**
 * Upload Service for handling file uploads to cloud storage
 */
export const uploadService = {
    /**
     * Upload a single file and get back the URL
     * @param file - File to upload
     * @param folder - Optional folder path (e.g., 'equipment', 'documents')
     * @returns Promise with uploaded file URL
     */
    uploadFile: async (file: File, folder?: string): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        if (folder) {
            formData.append("folder", folder);
        }

        const response = await apiClient<UploadResponse>("/upload", {
            method: "POST",
            body: formData,
        });

        return response.url;
    },

    /**
     * Upload multiple files and get back an array of URLs
     * @param files - Array of files to upload
     * @param folder - Optional folder path
     * @returns Promise with array of uploaded file URLs
     */
    uploadFiles: async (files: File[], folder?: string): Promise<string[]> => {
        const uploadPromises = files.map(file => uploadService.uploadFile(file, folder));
        return Promise.all(uploadPromises);
    },
};
