import { AppKeyInfo } from "@/components/connections/app-key-card";
import { apiRequest } from "@/lib/api/client";

export interface GenerateAppKeyRequest {
    name: string;
}

export interface GenerateAppKeyResponse {
    id: number;
    appKey: string;
    name: string;
}

interface AppKeyApiResponse {
    id: number;
    app_key: string;
    masked_key: string;
    name: string;
    status: "active" | "needs_reauth" | "disconnected";
    created_at: string;
    updated_at: string;
}

interface ListAppKeyApiWrapper {
    data: AppKeyApiResponse[];
}

export const AppKeyApi = {
    generate: async (body: GenerateAppKeyRequest) => {
        const res = await apiRequest<
            any,
            GenerateAppKeyRequest
        >(
            "POST",
            "/app-keys/generate",
            {
                body,
                validStatus: [201],
            }
        );

        // Map backend snake_case to camelCase
        const data: GenerateAppKeyResponse = {
            id: res.data.id,
            appKey: res.data.app_key,
            name: res.data.name

        };

        console.log(data);

        return data;
    },

    list: async (): Promise<AppKeyInfo[]> => {
        const res = await apiRequest<
            ListAppKeyApiWrapper,
            void
        >(
            "GET",
            "/app-keys", {
            validStatus: [200]
        }
        );

        return res.data.map(k => ({
            id: String(k.id),
            name: k.name,
            key: k.app_key,
            maskedKey: k.masked_key,
            status: k.status,
            createdAt: k.created_at,
            updatedAt: k.updated_at,
        }));
    },
};