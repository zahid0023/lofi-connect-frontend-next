"use client";

import { PlanCard } from "./PlanCard";
import type { SubscriptionPlan, TenantSubscription } from "@/services/subscriptions";

interface PlanGridProps {
    plans: SubscriptionPlan[];
    currentSubscription: TenantSubscription | null;
    subscribingPlanId: number | null;
    onSubscribe: (plan: SubscriptionPlan) => void;
}

export function PlanGrid({
    plans,
    currentSubscription,
    subscribingPlanId,
    onSubscribe,
}: PlanGridProps) {
    const isActiveSub =
        currentSubscription?.status === "ACTIVE" ||
        currentSubscription?.status === "TRIAL";

    if (plans.length === 0) {
        return (
            <p className="text-center text-sm text-muted-foreground py-16">
                No plans available at the moment.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
                <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrent={isActiveSub && currentSubscription?.plan_id === plan.id}
                    isSubscribing={subscribingPlanId === plan.id}
                    hasActiveSubscription={isActiveSub}
                    onSubscribe={onSubscribe}
                />
            ))}
        </div>
    );
}
