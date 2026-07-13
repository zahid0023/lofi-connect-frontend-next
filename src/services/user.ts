import { api } from "./api";

export interface UserProfile {
    id: number;
    user_name: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}

export const getMe = (): Promise<UserProfile> =>
    api.get<UserProfile>("/auth/me");

export const changePassword = (body: ChangePasswordRequest): Promise<void> =>
    api.post<void>("/auth/change-password", body);
