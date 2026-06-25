import { api } from "./api";

export interface GhlConnection {
    id: number;
    location_id: string;
    location_name: string;
}

export interface ApiKey {
    id: number;
    name: string;
    app_key: string | null;   // plain key — only present at generation time
    masked_key: string;
    status: "active" | "inactive";
    subscription_id: number;
    subscription_plan_id: number;
    subscription_plan_name: string;
    ghl_connection: GhlConnection | null;
    created_at: string;
    updated_at: string;
}

export interface CreateApiKeyRequest {
    name: string;
}

export interface AssignGhlRequest {
    app_key_id: number;
    location_id: string;
}

// POST /app-keys/generate  →  { "app_key": { ... } }
export const createApiKey = async (body: CreateApiKeyRequest): Promise<ApiKey> => {
    const res = await api.post<{ app_key: ApiKey }>("/app-keys/generate", body);
    return res.app_key;
};

// GET /app-keys  →  { "data": [...] }
export const getApiKeys = async (): Promise<ApiKey[]> => {
    const res = await api.get<{ data: ApiKey[] }>("/app-keys");
    return (res.data ?? []).filter(Boolean);
};

// PUT /app-keys/assign-ghl
export const assignGhl = async (body: AssignGhlRequest): Promise<ApiKey> => {
    const res = await api.put<{ app_key: ApiKey }>("/app-keys/assign-ghl", body);
    return res.app_key;
};
