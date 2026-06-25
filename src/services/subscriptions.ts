import { api } from "./api";

export interface PlanLimit {
    id: number;
    limit_key_id: number;
    limit_key_code: string;
    limit_key_name: string;
    limit_key_unit: string;
    limit_value: number;
}

export interface SubscriptionPlan {
    id: number;
    code: string;
    name: string;
    price: string;          // returned as decimal string, e.g. "29.00"
    currency_id: number;
    billing_cycle: "MONTHLY" | "QUARTERLY" | "ANNUAL" | "LIFETIME";
    trial_period_days: number;
    sort_order: number;
    is_public: boolean;
    description: string[];
    limits: PlanLimit[];
}

export interface TenantSubscription {
    id: number;
    user_id: number;
    plan_id: number;
    plan_code: string;
    plan_name: string;
    billing_cycle: "MONTHLY" | "QUARTERLY" | "ANNUAL" | "LIFETIME";
    price: string;
    status: "ACTIVE" | "TRIAL" | "CANCELLED" | "EXPIRED";
    start_date: string;
    end_date: string | null;
    trial_ends_at: string | null;
}

// GET /subscriptions/plans/public — flat array, no wrapper, no auth required
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    return api.get<SubscriptionPlan[]>("/subscriptions/plans/public");
};

// POST /subscriptions/tenant-subscriptions  →  { "success": true, "id": 42 }
export const createTenantSubscription = async (
    plan_id: number,
): Promise<{ success: boolean; id: number }> => {
    return api.post("/subscriptions/tenant-subscriptions", { plan_id });
};

// POST /subscriptions/tenant-subscriptions/upgrade  →  { "success": true, "id": 43 }
export const upgradeSubscription = async (
    new_plan_id: number,
): Promise<{ success: boolean; id: number }> => {
    return api.post("/subscriptions/tenant-subscriptions/upgrade", { new_plan_id });
};

// GET /subscriptions/tenant-subscriptions/me  →  { "subscription": { ... } }
export const getMySubscription = async (): Promise<TenantSubscription> => {
    const res = await api.get<{ subscription: TenantSubscription }>("/subscriptions/tenant-subscriptions/me");
    return res.subscription;
};

// DELETE /subscriptions/tenant-subscriptions/cancel  →  { "success": true, "id": 42 }
export const cancelSubscription = async (): Promise<{ success: boolean; id: number }> => {
    return api.delete("/subscriptions/tenant-subscriptions/cancel");
};
