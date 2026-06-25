"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, ArrowUpCircle, Check, CheckCircle2, Sparkles } from "lucide-react";
import {
    getSubscriptionPlans,
    createTenantSubscription,
    upgradeSubscription,
    SubscriptionPlan,
} from "@/services/subscriptions";
import { ApiError } from "@/services/api";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubscribed: () => void;
}

export function SubscribeDialog({ open, onClose, onSubscribed }: Props) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // "subscribe" = first time; "upgrade" = already has a sub, offer to switch
    const [mode, setMode] = useState<"subscribe" | "upgrade">("subscribe");

    useEffect(() => {
        if (!open) return;
        setMode("subscribe");
        setIsLoadingPlans(true);
        getSubscriptionPlans()
            .then(data => {
                setPlans(data ?? []);
                if (data?.length > 0) setSelectedPlanId(data[0].id);
            })
            .catch(() => toast.error("Failed to load subscription plans"))
            .finally(() => setIsLoadingPlans(false));
    }, [open]);

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    const handleSubmit = async () => {
        if (!selectedPlanId) return;
        setIsSubmitting(true);
        try {
            if (mode === "upgrade") {
                await upgradeSubscription(selectedPlanId);
            } else {
                await createTenantSubscription(selectedPlanId);
            }
            toast.success(mode === "upgrade" ? "Plan upgraded!" : "Subscription activated!");
            onSubscribed();
        } catch (err) {
            if (err instanceof ApiError && err.code === "ACTIVE_SUBSCRIPTION_EXISTS") {
                // User already has a subscription — switch to upgrade mode
                setMode("upgrade");
            } else {
                const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
                toast.error(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (plan: SubscriptionPlan) => {
        const price = parseFloat(plan.price);
        if (price === 0) return "Free";
        const suffix = plan.billing_cycle === "ANNUAL" ? "/ yr" : "/ mo";
        return `$${price.toFixed(2)} ${suffix}`;
    };

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {mode === "upgrade" ? (
                            <ArrowUpCircle className="h-5 w-5 text-primary" />
                        ) : (
                            <Sparkles className="h-5 w-5 text-primary" />
                        )}
                        {mode === "upgrade" ? "Switch Plan" : "Choose a Subscription Plan"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "upgrade" ? (
                            "You already have an active subscription. Switching will cancel it and start a new one immediately."
                        ) : (
                            "An active subscription is required to create API keys. Select a plan to get started."
                        )}
                    </DialogDescription>
                </DialogHeader>

                {mode === "upgrade" && selectedPlan && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                            Switching to <strong>{selectedPlan.name}</strong> will cancel your current subscription.
                            Any existing API keys will stop working — you'll need to generate new ones.
                        </span>
                    </div>
                )}

                <div className="py-2">
                    {isLoadingPlans ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                        </div>
                    ) : plans.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            No plans available. Please contact support.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {plans.map(plan => {
                                const isSelected = selectedPlanId === plan.id;
                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`relative w-full rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border hover:border-muted-foreground/30"
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute right-3 top-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            </span>
                                        )}

                                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                                            {plan.name}
                                        </p>

                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">{formatPrice(plan)}</span>
                                            {plan.trial_period_days > 0 && (
                                                <p className="text-xs text-primary mt-1">
                                                    {plan.trial_period_days}-day free trial
                                                </p>
                                            )}
                                        </div>

                                        <ul className="space-y-2">
                                            {plan.description.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedPlanId || isLoadingPlans || isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                {mode === "upgrade" ? "Switching..." : "Subscribing..."}
                            </span>
                        ) : mode === "upgrade" ? (
                            <>
                                <ArrowUpCircle className="mr-2 h-4 w-4" />
                                Switch Plan
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Subscribe
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
