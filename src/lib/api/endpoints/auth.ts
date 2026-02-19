import { TokenManager } from "@/lib/auth/token";
import { apiRequest } from "../client";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
}

export interface RegisterRequest {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    success: boolean;
    id: number;
}

export const AuthApi = {
    register: async (body: RegisterRequest): Promise<RegisterResponse> => {
        const res = await apiRequest<any, any>(
            "POST",
            "/api/v1/auth/registration/user",
            {
                body: {
                    full_name: body.fullName,
                    user_name: body.username,
                    password: body.password,
                    confirm_password: body.confirmPassword,
                },
                validStatus: [201],
            }
        );

        const data: RegisterResponse = {
            success: res.success,
            id: res.id,
        };

        return data;
    },

    login: async (body: LoginRequest): Promise<LoginResponse> => {
        const res = await apiRequest<any, any>(
            "POST",
            "/api/v1/auth/login",
            {
                body: {
                    user_name: body.username,
                    password: body.password,
                },
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