"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Copy,
    Eye,
    EyeOff,
    Key,
    Link2,
    MoreVertical,
    RefreshCw,
    RotateCcw,
    Trash2,
} from "lucide-react";
import { GHLConnection } from "@/types";
import { getStatusBadge } from "../utils/connectionHelpers";

interface Props {
    connection: GHLConnection;
    isKeyVisible: boolean;
    onToggleVisibility: () => void;
    onCopy: (key: string) => void;
    onRotateKey: () => void;
    onGenerateKey: () => void;
    onReauthorize: () => void;
    onDisconnect: () => void;
}

export function ConnectionCard({
    connection,
    isKeyVisible,
    onToggleVisibility,
    onCopy,
    onRotateKey,
    onGenerateKey,
    onReauthorize,
    onDisconnect,
}: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{connection.name}</CardTitle>
                        <CardDescription className="text-xs">
                            Location ID: {connection.locationId}
                        </CardDescription>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {getStatusBadge(connection.status)}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {connection.status !== "active" && (
                                <DropdownMenuItem onClick={onReauthorize}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reauthorize
                                </DropdownMenuItem>
                            )}
                            {connection.apiKey ? (
                                <DropdownMenuItem onClick={onRotateKey}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Rotate API Key
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={onGenerateKey}>
                                    <Key className="mr-2 h-4 w-4" />
                                    Generate API Key
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={onDisconnect}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Disconnect
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                        {connection.apiKey && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={onToggleVisibility}
                                >
                                    {isKeyVisible ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => onCopy(connection.apiKey!.key)}
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {connection.apiKey ? (
                        <div className="space-y-2">
                            <code className="block rounded bg-background px-3 py-2 font-mono text-sm">
                                {isKeyVisible ? connection.apiKey.key : connection.apiKey.maskedKey}
                            </code>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>
                                    Created: {new Date(connection.apiKey.createdAt).toLocaleDateString()}
                                </span>
                                {connection.apiKey.lastUsed && (
                                    <span>
                                        Last used: {new Date(connection.apiKey.lastUsed).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">No API key generated</p>
                            <Button size="sm" variant="outline" onClick={onGenerateKey}>
                                <Key className="mr-2 h-3 w-3" />
                                Generate Key
                            </Button>
                        </div>
                    )}
                </div>

                {/* Meta */}
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <div>
                        <span className="font-medium text-foreground">Created: </span>
                        {new Date(connection.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                        <span className="font-medium text-foreground">Last Sync: </span>
                        {new Date(connection.lastSync).toLocaleDateString()}
                    </div>
                    {connection.previousApiKeys.length > 0 && (
                        <div>
                            <span className="font-medium text-foreground">Previous Keys: </span>
                            {connection.previousApiKeys.length}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}