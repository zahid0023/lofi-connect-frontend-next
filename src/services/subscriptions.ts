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
    paddle_price_id: string; // Paddle Billing price ID, e.g. "pri_xxxxx"
}

export type TenantSubscriptionStatus =
    | "DRAFT"
    | "CHECKOUT_STARTED"
    | "TRIAL"
    | "ACTIVE"
    | "PROVISIONING_REQUIRED"
    | "PROVISIONING_IN_PROGRESS"
    | "PAST_DUE"
    | "GRACE_PERIOD"
    | "READ_ONLY"
    | "SUSPENDED"
    | "PAUSED"
    | "CANCELLED"
    | "EXPIRED"
    | "REFUND_REQUESTED"
    | "REFUNDED"
    | "SYNC_ERROR"
    | "REVIEW_REQUIRED";

export interface TenantSubscription {
    id: number;
    user_id: number;
    plan_id: number;
    plan_code: string;
    plan_name: string;
    billing_cycle: "MONTHLY" | "QUARTERLY" | "ANNUAL" | "LIFETIME";
    price: string;
    status: TenantSubscriptionStatus;
    start_date: string;
    end_date: string | null;
    trial_ends_at: string | null;
}

// GET /subscriptions/plans/public — flat array, no wrapper, no auth required
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    return api.get<SubscriptionPlan[]>("/subscriptions/plans/public");
};

// POST /payments/checkout  →  { checkout_url, transaction_id }
export const createCheckout = async (
    plan_id: number,
): Promise<{ checkout_url: string; transaction_id: string }> => {
    return api.post("/payments/checkout", { plan_id });
};

export interface PaymentStatus {
    subscription_status: TenantSubscriptionStatus | null;
    provisioning_status: "PENDING" | "PROVISIONED" | "FAILED" | null;
    active: boolean;
}

// GET /payments/status  →  { subscription_status, provisioning_status, active }
export const getPaymentStatus = async (): Promise<PaymentStatus> => {
    return api.get("/payments/status");
};

// Polls /payments/status until the subscription is active and provisioned.
// Throws if activation doesn't complete within the allotted attempts.
export async function waitForSubscriptionActive(maxAttempts = 10, intervalMs = 2000): Promise<PaymentStatus> {
    for (let i = 0; i < maxAttempts; i++) {
        const status = await getPaymentStatus();
        if (status.active && status.provisioning_status === "PROVISIONED") return status;
        if (i < maxAttempts - 1) await new Promise(r => setTimeout(r, intervalMs));
    }
    throw new Error("Subscription activation timed out");
}


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
