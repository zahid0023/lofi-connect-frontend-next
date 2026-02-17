import { TokenManager } from "@/lib/auth/token";
import { apiRequest } from "../client";

export interface LoginRequest {
    user_name: string;
    password: string;
}

export interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
}

export const AuthApi = {
    login: async (body: LoginRequest) => {
        const res = await apiRequest<
            any,
            LoginRequest>(
                "POST",
                "/auth/login",
                {
                    body,
                    validStatus: [200, 201]
                }
            );


        // Map backend snake_case to camelCase
        const data: LoginResponse = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            user: res.user,
        };

        // Save tokens for subsequent requests
        if (data.accessToken && data.refreshToken) {
            TokenManager.set(data.accessToken, data.refreshToken);
        }

        return data;
    },

    logout: () => {
        TokenManager.clear();
    },
};