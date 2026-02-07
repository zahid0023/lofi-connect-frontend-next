"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
import { GHLConnection } from "@/types";
import { ConnectionCard } from "./ConnectionCard";
import { ConnectDialog } from "@/app/(portal)/portal/connections/components/ConnectDialog";
import { useConnections } from "@/app/(portal)/portal/connections/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
    connections: GHLConnection[];
    visibleKeys: Set<string>;
    onToggleVisibility: (id: string) => void;
    onCopy: (key: string) => void;
    onRotateKey: (c: GHLConnection) => void;
    onGenerateKey: (c: GHLConnection) => void;
    onReauthorize: (c: GHLConnection) => void;
    onDisconnect: (c: GHLConnection) => void;
}

export function ConnectionList({
    connections,
    visibleKeys,
    onToggleVisibility,
    onCopy,
    onRotateKey,
    onGenerateKey,
    onReauthorize,
    onDisconnect,
}: Props) {
    const { user } = useAuth();

    const {
        isConnecting,
    } = useConnections(user?.id);

    if (connections.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">No connections yet</h3>
                    <p className="mb-4 text-center text-muted-foreground">
                        Connect your first GoHighLevel account to start using LofiConnect
                    </p>

                    <ConnectDialog isConnecting={isConnecting} />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {connections.map(c => (
                <ConnectionCard
                    key={c.id}
                    connection={c}
                    isKeyVisible={visibleKeys.has(c.id)}
                    onToggleVisibility={() => onToggleVisibility(c.id)}
                    onCopy={onCopy}
                    onRotateKey={() => onRotateKey(c)}
                    onGenerateKey={() => onGenerateKey(c)}
                    onReauthorize={() => onReauthorize(c)}
                    onDisconnect={() => onDisconnect(c)}
                />
            ))}
        </div>
    );
}