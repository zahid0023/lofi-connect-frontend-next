"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { AppKeyCard, AppKeyInfo } from "@/components/connections/app-key-card";

interface Props {
    appKeys: AppKeyInfo[];
}

export function AppKeyList({
    appKeys,
}: Props) {
    if (appKeys.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No connections yet</h3>
                    <p className="mb-4 text-center text-muted-foreground">
                        Connect your first GoHighLevel account to start using LofiConnect
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {appKeys.map(k => (
                <AppKeyCard
                    key={k.id}
                    apiKey={k}
                />
            ))}
        </div>
    );
}