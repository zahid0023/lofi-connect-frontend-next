"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Copy,
    Eye, Key,
    Link2
} from "lucide-react";

export interface AppKeyInfo {
    id: string;
    name: string;
    key: string;
    maskedKey: string;
    status: "active" | "needs_reauth" | "disconnected";
    createdAt: string;
    updatedAt: string;
}

interface Props {
    apiKey: AppKeyInfo;
}

export function AppKeyCard({
    apiKey,
}: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{apiKey.name}</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* API Key */}
                <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Key className="h-4 w-4 text-primary" />
                            API Key
                        </div>
                        {apiKey && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>


                    <div className="space-y-2">
                        <code className="block rounded bg-background px-3 py-2 font-mono text-sm">
                            {apiKey.key}
                        </code>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>
                                Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                            </span>
                            {apiKey.updatedAt && (
                                <span>
                                    Last used: {new Date(apiKey.updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <p>
                        Only One Api Key Per GHL Connection
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}