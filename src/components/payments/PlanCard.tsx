"use client";

import { Check, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/services/subscriptions";

interface PlanCardProps {
    plan: SubscriptionPlan;
    isCurrent?: boolean;
    isSubscribing?: boolean;
    hasActiveSubscription?: boolean;
    onSubscribe: (plan: SubscriptionPlan) => void;
}

function formatPrice(plan: SubscriptionPlan): string {
    const price = parseFloat(plan.price);
    if (price === 0) return "Free";
    const suffix =
        plan.billing_cycle === "ANNUAL"
            ? "/ yr"
            : plan.billing_cycle === "LIFETIME"
              ? " one-time"
              : "/ mo";
    return `$${price.toFixed(2)} ${suffix}`;
}

export function PlanCard({
    plan,
    isCurrent = false,
    isSubscribing = false,
    hasActiveSubscription = false,
    onSubscribe,
}: PlanCardProps) {
    return (
        <div
            className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all ${
                isCurrent
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-muted-foreground/40 hover:shadow-sm"
            }`}
        >
            {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground whitespace-nowrap">
                    Current Plan
                </span>
            )}

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {plan.name}
            </p>

            <div className="mb-1">
                <span className="text-4xl font-bold">{formatPrice(plan)}</span>
            </div>

            {plan.trial_period_days > 0 && (
                <p className="text-xs text-primary mt-1 mb-2">
                    {plan.trial_period_days}-day free trial
                </p>
            )}

            <ul className="flex-1 space-y-2 mt-4 mb-6">
                {plan.description.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        {feature}
                    </li>
                ))}
            </ul>

            {isCurrent ? (
                <Button variant="outline" disabled className="w-full">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Current Plan
                </Button>
            ) : (
                <Button
                    className="w-full"
                    onClick={() => onSubscribe(plan)}
                    disabled={isSubscribing}
                >
                    {isSubscribing ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Processing...
                        </span>
                    ) : (
                        <>
                            <Zap className="mr-2 h-4 w-4" />
                            {hasActiveSubscription ? "Switch to this Plan" : "Subscribe"}
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
