import { api } from "./api";

export type Trend = "UP" | "DOWN" | "NEUTRAL";

export interface StatCard {
    value: number;
    change_percentage: number | null;
    trend: Trend;
    icon: string;
}

export interface UsageStatsResponse {
    total_calls: StatCard;
    success_rate: StatCard;
    errors: StatCard;
    avg_calls_per_day: StatCard;
}

export const getMyStats = (range: number): Promise<UsageStatsResponse> =>
    api.get<UsageStatsResponse>(`/usage-logs/stats/me?range=${range}`);

export interface DailyUsagePoint {
    date: string;
    api_calls: number;
    errors: number;
}

export interface DailyUsageResponse {
    range_days: number;
    data: DailyUsagePoint[];
}

export const getMyDailyUsage = (range: number): Promise<DailyUsageResponse> =>
    api.get<DailyUsageResponse>(`/usage-logs/daily/me?range=${range}`);

export interface ConnectionInfo {
    platform: string;
    company_id: string;
    subaccount_name: string;
    location_id: string;
    user_type: "Agency" | "Location";
}

export interface ConnectionUsageItem {
    app_key_id: number;
    app_key_name: string;
    connected: boolean;
    connection: ConnectionInfo | null;
    total_calls: number;
    errors: number;
    error_rate: number;
    avg_response_time_ms: number | null;
}

export interface UsageByConnectionResponse {
    range_days: number;
    data: ConnectionUsageItem[];
}

export const getUsageByConnection = (range: number): Promise<UsageByConnectionResponse> =>
    api.get<UsageByConnectionResponse>(`/usage-logs/by-connection/me?range=${range}`);
