"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiKey } from "@/services/apiKeys";
import { ApiKeyCard } from "./ApiKeyCard";

interface Props {
    apiKeys: ApiKey[];
    isLoading: boolean;
    onCopy: (key: string) => void;
    onCreateKey: () => void;
}

export function ApiKeyList({
    apiKeys,
    isLoading,
    onCopy,
    onCreateKey,
}: Props) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
        );
    }

    const validKeys = (apiKeys ?? []).filter(Boolean);

    if (validKeys.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                No API keys yet.{" "}
                <button className="underline" onClick={onCreateKey}>
                    Create one
                </button>
                .
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {validKeys.map(apiKey => (
                <ApiKeyCard
                    key={apiKey.id}
                    apiKey={apiKey}
                    onCopy={onCopy}
                />
            ))}
        </div>
    );
}
