"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Copy, Eye, EyeOff, Link2, Building2, User, ShieldCheck, Trash2, CheckCircle2, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiKey } from "@/services/apiKeys";
import { initGhlConnection } from "@/services/connections";

interface Props {
    apiKey: ApiKey;
    onCopy: (key: string) => void;
    onDelete: (id: number) => void;
}

export function ApiKeyCard({ apiKey, onCopy, onDelete }: Props) {
    const [visible, setVisible] = useState(false);

    const displayKey = visible && apiKey.app_key ? apiKey.app_key : apiKey.masked_key;
    const canReveal = !!apiKey.app_key;
    const ghl = apiKey.ghl_connection;

    return (
        <Card>
            <CardContent className="pt-4 space-y-3">
                {/* Name + badges + actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{apiKey.name}</span>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"} className="text-xs">
                            {apiKey.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {apiKey.subscription_plan_name}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Connect dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs">
                                    <Link2 className="h-3.5 w-3.5" />
                                    Connect
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-xs">Connect using this key</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => initGhlConnection(apiKey.id)}>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Connect to GHL
                                    {ghl && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-green-500" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open("https://www.make.com", "_blank")}>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Connect to Make.com
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open("https://zapier.com", "_blank")}>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Connect to Zapier
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title={visible ? "Hide key" : "Show key"}
                            disabled={!canReveal}
                            onClick={() => setVisible(v => !v)}
                        >
                            {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Copy key"
                            onClick={() => onCopy(apiKey.app_key || apiKey.masked_key)}
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Delete key"
                            onClick={() => onDelete(apiKey.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Key display */}
                <code className="block rounded bg-muted px-3 py-2 font-mono text-sm break-all">
                    {displayKey}
                </code>

                {/* GHL connection */}
                <div className="rounded-lg border px-3 py-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-medium mb-2">
                        {ghl ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span>GoHighLevel</span>
                        <Badge
                            variant={ghl ? "default" : "secondary"}
                            className="ml-1 text-[10px] px-1.5 py-0"
                        >
                            {ghl ? "Connected" : "Not connected"}
                        </Badge>
                    </div>

                    {ghl && (
                        <>
                            <Separator className="mb-2" />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{ghl.sub_account_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3 shrink-0" />
                                    <span className="truncate font-mono">{ghl.user_id}</span>
                                </div>
                                <div className="col-span-2 flex items-center gap-1.5 mt-0.5">
                                    <span className="text-foreground font-medium">Account ID:</span>
                                    <span className="font-mono truncate">{ghl.sub_account_id}</span>
                                    {ghl.is_agency && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">Agency</Badge>
                                    )}
                                </div>
                                <div className="col-span-2 flex items-start gap-1.5 mt-0.5">
                                    <ShieldCheck className="h-3 w-3 shrink-0 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                        {ghl.scopes.split(" ").map(scope => (
                                            <Badge key={scope} variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                                                {scope}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Meta */}
                <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(apiKey.updated_at).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
