import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { getToken } from "@/services/api";
import { createCheckout } from "@/services/subscriptions";

function getUserIdFromToken(): number | null {
    const jwt = getToken();
    if (!jwt) return null;
    try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        return payload.user_id ?? payload.sub ?? null;
    } catch {
        return null;
    }
}

let paddleInstance: Paddle | undefined;

async function getPaddleInstance(): Promise<Paddle> {
    if (paddleInstance) return paddleInstance;

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) throw new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set");

    const instance = await initializePaddle({
        environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ?? "sandbox",
        token,
    });

    if (!instance) throw new Error("Failed to initialize Paddle");
    paddleInstance = instance;
    return paddleInstance;
}

interface CheckoutOptions {
    planId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// Opens a Paddle overlay using the transaction created by the backend.
// The backend embeds user_id + plan_id in custom_data so the webhook
// processor can create the subscription without any frontend involvement.
export async function openPaddleCheckout({ planId, onSuccess, onCancel }: CheckoutOptions): Promise<void> {
    const [paddle, { transaction_id }] = await Promise.all([
        getPaddleInstance(),
        createCheckout(planId),
    ]);

    paddle.Checkout.open({
        transactionId: transaction_id,
        customData: { plan_id: planId, user_id: getUserIdFromToken() },
        eventCallback(event) {
            if (event.name === "checkout.completed") onSuccess?.();
            if (event.name === "checkout.closed") {
                const status = (event.data as { status?: string } | null)?.status;
                if (status !== "completed") onCancel?.();
            }
        },
    });
}
