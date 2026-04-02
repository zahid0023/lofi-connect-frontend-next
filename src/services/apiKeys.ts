import { api } from "./api";

export interface GhlConnection {
    company_id: string;
    is_agency: boolean;
    sub_account_id: string;
    sub_account_name: string;
    scopes: string;
    user_id: string;
}

// Shape returned by the backend inside `data`
export interface ApiKey {
    id: number;
    app_key: string;        // plain key — only present at creation/rotation
    name: string;
    masked_key: string;
    status: "active" | "revoked";
    created_at: string;
    updated_at: string;
    subscription_id: number;
    subscription_plan_id: number;
    subscription_plan_name: string;
    ghl_connection: GhlConnection | null;
}

// All responses are wrapped: { data: T }
interface ApiResponse<T> {
    data: T;
}

export interface CreateApiKeyRequest {
    name: string;
}

export interface UpdateApiKeyRequest {
    name?: string;
    status?: "active" | "revoked";
}

// POST /app-keys/generate
export const createApiKey = async (body: CreateApiKeyRequest): Promise<ApiKey> => {
    const res = await api.post<ApiResponse<ApiKey>>("/app-keys/generate", body);
    return res.data;
};

// GET /app-keys
export const getApiKeys = async (): Promise<ApiKey[]> => {
    const res = await api.get<ApiResponse<ApiKey[]>>("/app-keys");
    return res.data;
};

// GET /app-keys/:id
export const getApiKey = async (id: number): Promise<ApiKey> => {
    const res = await api.get<ApiResponse<ApiKey>>(`/app-keys/${id}`);
    return res.data;
};

// PUT /app-keys/:id
export const updateApiKey = async (id: number, body: UpdateApiKeyRequest): Promise<ApiKey> => {
    const res = await api.put<ApiResponse<ApiKey>>(`/app-keys/${id}`, body);
    return res.data;
};

// PATCH /app-keys/:id
export const patchApiKey = async (id: number, body: UpdateApiKeyRequest): Promise<ApiKey> => {
    const res = await api.patch<ApiResponse<ApiKey>>(`/app-keys/${id}`, body);
    return res.data;
};

// POST /app-keys/:id/rotate
export const rotateApiKey = async (id: number): Promise<ApiKey> => {
    const res = await api.post<ApiResponse<ApiKey>>(`/app-keys/${id}/rotate`, {});
    return res.data;
};

// DELETE /app-keys/:id
export const deleteApiKey = (id: number): Promise<void> =>
    api.delete<void>(`/app-keys/${id}`);
