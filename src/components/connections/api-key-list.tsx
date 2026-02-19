"use client";

import { ApiKeyCard, ApiKeyInfo } from "@/components/connections/api-key-card";
import { Card, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

interface Props {
    appKeys: ApiKeyInfo[];
    onConnectClick: (key: ApiKeyInfo) => void;
}

export function ApiKeyList({
    appKeys,
    onConnectClick
}: Props) {
    if (appKeys.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Key className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No API Keys yet</h3>
                    <p className="mb-4 text-center text-muted-foreground">
                        Create an app key to connect your GoHighLevel account and start syncing data.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {appKeys.map(k => (
                <ApiKeyCard
                    key={k.id}
                    apiKey={k}
                    onConnectClick={() => onConnectClick(k)}
                />
            ))}
        </div>
    );
}