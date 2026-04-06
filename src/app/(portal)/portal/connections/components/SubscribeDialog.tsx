"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { getSubscriptionPlans, SubscriptionPlan } from "@/services/subscriptions";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubscribed: () => void;
}

export function SubscribeDialog({ open, onClose, onSubscribed }: Props) {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);

    useEffect(() => {
        if (!open) return;
        setIsLoadingPlans(true);
        getSubscriptionPlans()
            .then(data => {
                setPlans(data);
                if (data.length > 0) setSelectedPlanId(data[0].id);
            })
            .catch(() => toast.error("Failed to load subscription plans"))
            .finally(() => setIsLoadingPlans(false));
    }, [open]);

    const handleContactUs = () => {
        onClose();
        router.push("/portal/contact-subscription");
    };

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Choose a Subscription Plan
                    </DialogTitle>
                    <DialogDescription>
                        An active subscription is required to create API keys. Select a plan to get started.
                    </DialogDescription>
                </DialogHeader>

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
                                        {/* Selected indicator */}
                                        {isSelected && (
                                            <span className="absolute right-3 top-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            </span>
                                        )}

                                        {/* Plan name */}
                                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                                            {plan.name}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-end gap-1 mb-4">
                                            <span className="text-3xl font-bold">
                                                {plan.currency.symbol}{plan.price.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-muted-foreground mb-0.5">/ mo</span>
                                        </div>

                                        {/* Features */}
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
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleContactUs} disabled={isLoadingPlans}>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Us
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
