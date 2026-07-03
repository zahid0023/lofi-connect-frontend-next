"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cancelSubscription } from "@/services/subscriptions";
import type { TenantSubscription, TenantSubscriptionStatus } from "@/services/subscriptions";

interface CurrentPlanBannerProps {
    subscription: TenantSubscription;
    onCancelled?: () => void;
}

type StatusConfig = {
    icon: typeof CheckCircle2;
    banner: string;
    iconColor: string;
    label: string;
    message?: string;
};

const STATUS_CONFIG: Record<TenantSubscriptionStatus, StatusConfig> = {
    ACTIVE: {
        icon: CheckCircle2,
        banner: "border-primary/30 bg-primary/5",
        iconColor: "text-primary",
        label: "Active",
    },
    TRIAL: {
        icon: CheckCircle2,
        banner: "border-blue-400/30 bg-blue-50 dark:bg-blue-950/20",
        iconColor: "text-blue-500",
        label: "Trial",
    },
    PROVISIONING_REQUIRED: {
        icon: Clock,
        banner: "border-blue-400/30 bg-blue-50 dark:bg-blue-950/20",
        iconColor: "text-blue-500",
        label: "Setting Up",
        message: "Setting up your account. API keys will be available shortly.",
    },
    PROVISIONING_IN_PROGRESS: {
        icon: Clock,
        banner: "border-blue-400/30 bg-blue-50 dark:bg-blue-950/20",
        iconColor: "text-blue-500",
        label: "Setting Up",
        message: "Account setup in progress. You will receive an email when ready.",
    },
    PAST_DUE: {
        icon: AlertTriangle,
        banner: "border-yellow-400/40 bg-yellow-50 dark:bg-yellow-950/20",
        iconColor: "text-yellow-500",
        label: "Past Due",
        message: "Payment is past due. Please update your payment method.",
    },
    GRACE_PERIOD: {
        icon: AlertTriangle,
        banner: "border-yellow-400/40 bg-yellow-50 dark:bg-yellow-950/20",
        iconColor: "text-yellow-500",
        label: "Grace Period",
        message: "Payment failed. Update your payment method to avoid losing access.",
    },
    READ_ONLY: {
        icon: AlertCircle,
        banner: "border-orange-400/40 bg-orange-50 dark:bg-orange-950/20",
        iconColor: "text-orange-500",
        label: "Read Only",
        message: "Access limited to dashboard. Update payment to restore full access.",
    },
    SUSPENDED: {
        icon: XCircle,
        banner: "border-destructive/40 bg-destructive/10",
        iconColor: "text-destructive",
        label: "Suspended",
        message: "Account suspended. Contact support to reactivate.",
    },
    PAUSED: {
        icon: Clock,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Paused",
        message: "Subscription paused. Resume it in the Paddle customer portal.",
    },
    CANCELLED: {
        icon: AlertCircle,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Cancelled",
    },
    EXPIRED: {
        icon: XCircle,
        banner: "border-destructive/40 bg-destructive/10",
        iconColor: "text-destructive",
        label: "Expired",
        message: "Subscription has expired. Subscribe to regain access.",
    },
    REFUND_REQUESTED: {
        icon: AlertCircle,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Refund Under Review",
        message: "Refund under review. Access is suspended pending outcome.",
    },
    REFUNDED: {
        icon: XCircle,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Refunded",
        message: "Refund processed. Your subscription has ended.",
    },
    SYNC_ERROR: {
        icon: AlertCircle,
        banner: "border-destructive/40 bg-destructive/10",
        iconColor: "text-destructive",
        label: "Sync Error",
        message: "There's a sync issue with your subscription. Please contact support.",
    },
    REVIEW_REQUIRED: {
        icon: AlertCircle,
        banner: "border-destructive/40 bg-destructive/10",
        iconColor: "text-destructive",
        label: "Under Review",
        message: "Your account is under review. Contact support for details.",
    },
    DRAFT: {
        icon: Clock,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Draft",
    },
    CHECKOUT_STARTED: {
        icon: Clock,
        banner: "border-border bg-muted/50",
        iconColor: "text-muted-foreground",
        label: "Checkout Started",
    },
};

const CANCELLABLE_STATUSES: TenantSubscriptionStatus[] = [
    "ACTIVE",
    "TRIAL",
    "GRACE_PERIOD",
    "PAST_DUE",
];

export function CurrentPlanBanner({ subscription, onCancelled }: CurrentPlanBannerProps) {
    const [isCancelling, setIsCancelling] = useState(false);

    const config = STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.ACTIVE;
    const Icon = config.icon;
    const canCancel = CANCELLABLE_STATUSES.includes(subscription.status);

    const handleCancel = async () => {
        setIsCancelling(true);
        try {
            await cancelSubscription();
            toast.success("Cancellation scheduled. You'll retain access until the end of your billing period.");
            onCancelled?.();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to cancel subscription.";
            toast.error(message);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${config.banner}`}>
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconColor}`} />
            <div className="flex-1 min-w-0 text-sm">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-medium">Plan: {subscription.plan_name}</span>
                    <span className="text-muted-foreground">({config.label})</span>
                    {subscription.end_date && subscription.status === "ACTIVE" && (
                        <span className="text-muted-foreground">
                            · Renews {new Date(subscription.end_date).toLocaleDateString()}
                        </span>
                    )}
                    {subscription.trial_ends_at && subscription.status === "TRIAL" && (
                        <span className="text-muted-foreground">
                            · Trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}
                        </span>
                    )}
                    {subscription.end_date && subscription.status === "CANCELLED" && (
                        <span className="text-muted-foreground">
                            · Access until {new Date(subscription.end_date).toLocaleDateString()}
                        </span>
                    )}
                </div>
                {config.message && (
                    <p className="mt-1 text-muted-foreground">{config.message}</p>
                )}
            </div>
            {canCancel && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                            disabled={isCancelling}
                        >
                            Cancel Plan
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your subscription will be cancelled at the end of your current billing period
                                {subscription.end_date
                                    ? ` on ${new Date(subscription.end_date).toLocaleDateString()}`
                                    : ""}
                                . You'll keep full access until then.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancel}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isCancelling ? "Cancelling…" : "Yes, Cancel"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
