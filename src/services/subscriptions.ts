import { api } from "./api";

export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    description: string[];
    currency: {
        code: string;
        symbol: string;
    };
    limits: {
        id: number;
        limit_key: {
            id: number;
            limit_key: string;
            description: string;
            unit: string;
        };
        limit_value: number;
    }[];
}

interface PlansResponse {
    subscription_plans: SubscriptionPlan[];
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    const res = await api.get<PlansResponse>("/subscriptions/tenant-subscriptions");
    return res.subscription_plans;
};

export const createTenantSubscription = async (
    subscription_plan_id: number,
    auto_renew: boolean,
): Promise<{ success: boolean; id: number }> => {
    return api.post("/subscriptions/tenant-subscriptions", { subscription_plan_id, auto_renew });
};
