"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PlanGrid } from "@/components/payments/PlanGrid";
import { CurrentPlanBanner } from "@/components/payments/CurrentPlanBanner";
import {
    getSubscriptionPlans,
    getMySubscription,
    waitForSubscriptionActive,
    type SubscriptionPlan,
    type TenantSubscription,
} from "@/services/subscriptions";
import { openPaddleCheckout } from "@/lib/paddle";

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [mySubscription, setMySubscription] = useState<TenantSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(null);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getSubscriptionPlans(),
            getMySubscription().catch(() => null),
        ])
            .then(([plansData, subData]) => {
                setPlans(plansData ?? []);
                setMySubscription(subData);
            })
            .catch(() => toast.error("Failed to load subscription plans"))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setSubscribingPlanId(plan.id);
        try {
            await openPaddleCheckout({
                planId: plan.id,
                onSuccess: async () => {
                    toast.info("Activating your subscription…");
                    try {
                        await waitForSubscriptionActive();
                        toast.success("Your subscription is now active!");
                    } catch {
                        toast.info("Your subscription is being set up. It may take a moment.");
                    } finally {
                        getMySubscription().catch(() => null).then(setMySubscription);
                    }
                },
                onCancel: () => toast.info("Checkout closed."),
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to open checkout.";
            toast.error(message);
        } finally {
            setSubscribingPlanId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Subscription Plans
                </h1>
                <p className="text-muted-foreground">
                    Choose the plan that fits your needs. Upgrade or change anytime.
                </p>
            </div>

            {mySubscription && (
                <CurrentPlanBanner subscription={mySubscription} />
            )}

            <PlanGrid
                plans={plans}
                currentSubscription={mySubscription}
                subscribingPlanId={subscribingPlanId}
                onSubscribe={handleSubscribe}
            />
        </div>
    );
}
