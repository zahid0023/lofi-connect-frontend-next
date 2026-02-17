"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Copy,
    Eye, EyeOff, Key,
    Link2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface GhlConnectionInfo {
    companyId: string;
    isAgency: boolean;
    subAccountId: string;
    subAccountName: string;
    scopes: string;
    userId: string;
}

export interface AppKeyInfo {
    id: string;
    name: string;
    key: string;
    maskedKey: string;
    status: "active" | "needs_reauth" | "disconnected";
    createdAt: string;
    updatedAt: string;

    ghlConnection?: GhlConnectionInfo | null;
}

interface Props {
    apiKey: AppKeyInfo;
    onConnectClick: (key: AppKeyInfo) => void;
}

export function AppKeyCard({
    apiKey,
    onConnectClick
}: Props) {
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copyDisabled, setCopyDisabled] = useState(false);

    const handleToggle = () => {
        setShowKey(prev => !prev);
    };

    const handleCopy = async () => {
        if (copyDisabled) return;

        await navigator.clipboard.writeText(apiKey.key);

        toast("API key copied",
            {
                description: "The full API key has been copied to your clipboard."
            },
        );

        setCopyDisabled(true);

        setTimeout(() => {
            setCopyDisabled(false);
        }, 5000);
    };

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

                        {/* Connections */}
                        <div className="flex items-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Connections</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={() => onConnectClick(apiKey)}
                                    >
                                        {apiKey.ghlConnection
                                            ? "View GHL Connection"
                                            : "Connect GHL"
                                        }
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        Make
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Zapier
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleToggle}
                            >
                                {showKey ? (
                                    <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                    <Eye className="h-3.5 w-3.5" />
                                )}
                            </Button>

                            {/* Copy */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleCopy}
                                disabled={copyDisabled}
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>


                    {/* Key Display */}
                    <div className="space-y-2">
                        <code className="block rounded bg-background px-3 py-2 font-mono text-sm">
                            {showKey ? apiKey.key : apiKey.maskedKey}
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
            </CardContent>

            <CardFooter>
                {/* Meta */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <p>
                        Only One Api Key Per GHL Connection
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}