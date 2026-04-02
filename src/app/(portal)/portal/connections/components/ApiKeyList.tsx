"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiKey } from "@/services/apiKeys";
import { ApiKeyCard } from "./ApiKeyCard";

interface Props {
    apiKeys: ApiKey[];
    isLoading: boolean;
    onCopy: (key: string) => void;
    onCreateKey: () => void;
    onDeleteKey: (id: number) => void;
}

export function ApiKeyList({
    apiKeys,
    isLoading,
    onCopy,
    onCreateKey,
    onDeleteKey,
}: Props) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
        );
    }

    if (apiKeys.length === 0) {
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
            {apiKeys.map(apiKey => (
                <ApiKeyCard
                    key={apiKey.id}
                    apiKey={apiKey}
                    onCopy={onCopy}
                    onDelete={onDeleteKey}
                />
            ))}
        </div>
    );
}
