"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPaymentStatus, type PaymentStatus } from "@/services/subscriptions";

type PollingState = "polling" | "active" | "timeout";

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForActivation(maxAttempts = 10, intervalMs = 2000): Promise<PaymentStatus> {
    for (let i = 0; i < maxAttempts; i++) {
        const status = await getPaymentStatus();
        if (status.active && status.provisioning_status === "PROVISIONED") {
            return status;
        }
        if (i < maxAttempts - 1) await sleep(intervalMs);
    }
    throw new Error("timeout");
}

export default function SubscriptionSuccessPage() {
    const [state, setState] = useState<PollingState>("polling");

    useEffect(() => {
        waitForActivation()
            .then(() => setState("active"))
            .catch(() => setState("timeout"));
    }, []);

    if (state === "polling") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <h1 className="text-2xl font-bold">Confirming your payment…</h1>
                <p className="text-muted-foreground max-w-md">
                    This usually takes just a moment. Please don't close this tab.
                </p>
            </div>
        );
    }

    if (state === "timeout") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <Clock className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Taking a little longer…</h1>
                <p className="text-muted-foreground max-w-md">
                    Your payment was received but activation is still in progress.
                    Check back in a minute or contact support if this persists.
                </p>
                <div className="flex gap-3 mt-2">
                    <Button onClick={() => { setState("polling"); waitForActivation().then(() => setState("active")).catch(() => setState("timeout")); }}>
                        Check Again
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/billing">View Plans</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground max-w-md">
                Your subscription is now active. You can start creating API keys right away.
            </p>
            <div className="flex gap-3 mt-2">
                <Button asChild>
                    <Link href="/connections">Create API Key</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/billing">View Plans</Link>
                </Button>
            </div>
        </div>
    );
}
