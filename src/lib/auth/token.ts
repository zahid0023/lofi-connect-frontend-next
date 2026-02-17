const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const TokenManager = {
    getAccess(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefresh(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    set(access: string, refresh: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    },

    updateAccess(access: string) {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, access);
    },

    clear() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    hasAccess(): boolean {
        return !!this.getAccess();
    },
};