"use client";

import { useEffect } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined;

export function getPaddle(): Paddle | undefined {
    return paddleInstance;
}

export function PaddleProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (paddleInstance) return;
        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
        if (!token) return;
        initializePaddle({
            environment:
                (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") ??
                "sandbox",
            token,
        }).then((p) => {
            paddleInstance = p;
        });
    }, []);

    return <>{children}</>;
}
