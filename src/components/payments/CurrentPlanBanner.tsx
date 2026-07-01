import { CheckCircle2 } from "lucide-react";
import type { TenantSubscription } from "@/services/subscriptions";

interface CurrentPlanBannerProps {
    subscription: TenantSubscription;
}

export function CurrentPlanBanner({ subscription }: CurrentPlanBannerProps) {
    const isTrial = subscription.status === "TRIAL";

    return (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <div className="text-sm">
                <span className="font-medium">Active plan: {subscription.plan_name}</span>
                <span className="text-muted-foreground ml-2">
                    ({isTrial ? "Trial" : "Active"})
                </span>
                {subscription.end_date && (
                    <span className="text-muted-foreground ml-2">
                        · Renews {new Date(subscription.end_date).toLocaleDateString()}
                    </span>
                )}
            </div>
        </div>
    );
}
