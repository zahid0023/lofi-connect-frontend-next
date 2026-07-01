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
import { AlertCircle, ArrowUpCircle, Sparkles } from "lucide-react";
import {
    getSubscriptionPlans,
    upgradeSubscription,
    waitForSubscriptionActive,
    SubscriptionPlan,
} from "@/services/subscriptions";
import { ApiError } from "@/services/api";
import { toast } from "sonner";
import { PlanCard } from "@/components/payments/PlanCard";
import { openPaddleCheckout } from "@/lib/paddle";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubscribed: () => void;
}

export function SubscribeDialog({ open, onClose, onSubscribed }: Props) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(null);
    const [mode, setMode] = useState<"subscribe" | "upgrade">("subscribe");

    useEffect(() => {
        if (!open) return;
        setMode("subscribe");
        setIsLoadingPlans(true);
        getSubscriptionPlans()
            .then(data => setPlans(data ?? []))
            .catch(() => toast.error("Failed to load subscription plans"))
            .finally(() => setIsLoadingPlans(false));
    }, [open]);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        setSubscribingPlanId(plan.id);
        try {
            if (mode === "upgrade") {
                await upgradeSubscription(plan.id);
                toast.success("Plan switched!");
                onSubscribed();
                return;
            }

            await openPaddleCheckout({
                planId: plan.id,
                onSuccess: async () => {
                    toast.info("Activating your subscription…");
                    try {
                        await waitForSubscriptionActive();
                        toast.success("Payment successful! Your subscription is now active.");
                    } catch {
                        toast.info("Your subscription is being set up. It may take a moment.");
                    } finally {
                        onSubscribed();
                    }
                },
                onCancel: () => toast.info("Checkout closed."),
            });
            onClose();
        } catch (err) {
            if (err instanceof ApiError && err.code === "ACTIVE_SUBSCRIPTION_EXISTS") {
                setMode("upgrade");
            } else {
                const message = err instanceof Error ? err.message : "Something went wrong.";
                toast.error(message);
            }
        } finally {
            setSubscribingPlanId(null);
        }
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

                {mode === "upgrade" && (
                    <div className="flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                            Switching plans will cancel your current subscription.
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
                            {plans.map(plan => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isSubscribing={subscribingPlanId === plan.id}
                                    hasActiveSubscription={mode === "upgrade"}
                                    onSubscribe={handleSubscribe}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={onClose} disabled={subscribingPlanId !== null}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
