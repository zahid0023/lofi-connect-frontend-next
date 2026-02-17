import { toast } from "sonner";
import { TokenManager } from "../auth/token";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody = unknown> {
    path?: Record<string, string | number>;
    query?: Record<string, string | number | boolean | undefined>;
    body?: TBody;
    headers?: HeadersInit;
    validStatus?: number[]; // optional list of success codes
    retry?: boolean; // internal use for refresh retry
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";


// Build URL with path variables and query params
function buildUrl(
    endpoint: string,
    path?: Record<string, string | number>,
    query?: Record<string, string | number | boolean | undefined>
) {
    let url = endpoint;

    if (path) {
        for (const [key, value] of Object.entries(path)) {
            url = url.replace(`:${key}`, encodeURIComponent(String(value)));
        }
    }

    const params = new URLSearchParams();
    if (query) {
        Object.entries(query).forEach(([k, v]) => {
            if (v !== undefined) params.append(k, String(v));
        });
    }

    const qs = params.toString();
    return `${BASE_URL}${url}${qs ? `?${qs}` : ""}`;
}

// Optional: implement refresh token endpoint
async function refreshToken(): Promise<boolean> {
    const refresh = TokenManager.getRefresh();
    if (!refresh) return false;

    try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refresh }),
        });

        if (!res.ok) throw new Error("Refresh token failed");

        const data = await res.json();
        TokenManager.updateAccess(data.access_token);
        return true;
    } catch {
        TokenManager.clear();
        return false;
    }
}

// Generic API request function
export async function apiRequest<TResponse, TBody = unknown>(
    method: HttpMethod,
    endpoint: string,
    options?: RequestOptions<TBody>
): Promise<TResponse> {
    const url = buildUrl(endpoint, options?.path, options?.query);
    const token = TokenManager.getAccess();

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const validStatus = options?.validStatus ?? [200, 201, 202, 204];

    if (!validStatus.includes(res.status)) {
        if (res.status === 401 && !options?.retry) {
            const refreshed = await refreshToken();
            if (refreshed) {
                // retry original request with new access token
                return apiRequest<TResponse, TBody>(method, endpoint, { ...options, retry: true });
            }
        }

        let message = `Request failed with status ${res.status}`;
        try {
            const err = await res.json();
            message = err.message || message;
            toast.error(message);
        } catch {
        }
        toast.error(message);
        throw new Error(message);
    }

    if (res.status === 204) return null as TResponse;

    return res.json();
}