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

interface GhlConnectionApiResponse {
    company_id: string;
    is_agency: boolean;
    sub_account_id: string;
    sub_account_name: string;
    scopes: string;
    user_id: string;
}

interface AppKeyApiResponse {
    id: number;
    app_key: string;
    masked_key: string;
    name: string;
    status: "active" | "needs_reauth" | "disconnected";
    created_at: string;
    updated_at: string;

    ghl_connection?: GhlConnectionApiResponse | null;
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
            "/api/v1/app-keys/generate",
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
            "/api/v1/app-keys", {
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

            ghlConnection: k.ghl_connection ? {
                companyId: k.ghl_connection.company_id,
                isAgency: k.ghl_connection.is_agency,
                subAccountId: k.ghl_connection.sub_account_id,
                subAccountName: k.ghl_connection.sub_account_name,
                scopes: k.ghl_connection.scopes,
                userId: k.ghl_connection.user_id,
            } :
                null
        }));
    },
};