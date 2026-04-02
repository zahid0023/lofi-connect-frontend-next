const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "access_token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const message = await res.text().catch(() => res.statusText);
        throw new Error(message || `Request failed: ${res.status}`);
    }

    if (res.status === 204) return undefined as T;

    return res.json();
}

export const api = {
    get: <T>(path: string, options?: RequestInit) =>
        apiFetch<T>(path, { ...options, method: "GET" }),

    post: <T>(path: string, body: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(path: string, body: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    patch: <T>(path: string, body: unknown, options?: RequestInit) =>
        apiFetch<T>(path, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    delete: <T>(path: string, options?: RequestInit) =>
        apiFetch<T>(path, { ...options, method: "DELETE" }),
};
