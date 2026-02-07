"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useConnections } from "./hooks/useConnections";
import { ConnectDialog } from "./components/ConnectDialog";
import { RotateKeyDialog } from "./components/RotateKeyDialog";
import { ConnectionList } from "./components/ConnectionList";
import { GHLConnection } from "@/types";
import { ConnectionNameDialog } from "@/app/(portal)/portal/connections/components/ConnectionNameDialog";
import { ApiKeyDialog } from "@/app/(portal)/portal/connections/components/ApiKeyDialog";

export default function ConnectionsPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const codeFromUrl = searchParams.get("code");

    const {
        connections,
        visibleKeys,
        isConnecting,
        rotateKey,
        generateKey,
        reauthorize,
        disconnect,
        toggleKeyVisibility,
        copyToClipboard,
    } = useConnections(user?.id);

    const [newCode, setNewCode] = useState<string | null>(null);
    const [rotateTarget, setRotateTarget] = useState<GHLConnection | null>(null);
    const [editConnection, setEditConnection] = useState<GHLConnection | null>(null);
    const [newConnectionNameDialogOpen, setNewConnectionNameDialogOpen] = useState(false);

    const [newApiKey, setNewApiKey] = useState<string | null>(null);
    const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);

    // When the user comes back from OAuth with ?code=xxx
    useEffect(() => {
        if (codeFromUrl) {
            setNewCode(codeFromUrl);
            setNewConnectionNameDialogOpen(true); // <-- open the dialog

            // Clean URL
            const url = window.location.origin + window.location.pathname;
            window.history.replaceState({}, "", url);
        }
    }, [codeFromUrl]);

    const handleRotate = (connection: GHLConnection) => {
        const key = rotateKey(connection);
        setRotateTarget(null);
    };

    const handleGenerate = (connection: GHLConnection) => {
        const key = generateKey(connection);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Connections</h1>
                    <p className="text-muted-foreground">
                        Manage your GoHighLevel account connections and API keys
                    </p>
                </div>

                <ConnectDialog isConnecting={isConnecting} />
            </div>

            {/* Content */}
            <ConnectionList
                connections={connections}
                visibleKeys={visibleKeys}
                onToggleVisibility={toggleKeyVisibility}
                onCopy={copyToClipboard}
                onRotateKey={c => setRotateTarget(c)}
                onGenerateKey={handleGenerate}
                onReauthorize={reauthorize}
                onDisconnect={disconnect}
            />

            {/* Modals */}
            {/* New Connection Name Dialog (after OAuth redirect) */}
            <ConnectionNameDialog
                open={newConnectionNameDialogOpen}
                code={newCode}
                onClose={() => {
                    setNewConnectionNameDialogOpen(false);
                    setNewCode(null);
                }}
                onSubmit={() => { }}
                onSuccess={(appKey) => {
                    setNewApiKey(appKey);
                    setApiKeyDialogOpen(true);
                }}
            />

            {/* Edit existing connection */}
            <ConnectionNameDialog
                open={!!editConnection}
                initialName={editConnection?.name}
                code={null} // editing does not need code
                onClose={() => setEditConnection(null)}
                onSubmit={() => {
                    if (!editConnection) return;
                    setEditConnection(null);
                }}
            />

            <RotateKeyDialog
                open={!!rotateTarget}
                onCancel={() => setRotateTarget(null)}
                onConfirm={() => rotateTarget && handleRotate(rotateTarget)}
            />

            {/* ✅ API Key Dialog */}
            <ApiKeyDialog
                open={apiKeyDialogOpen}
                apiKey={newApiKey}
                onClose={() => {
                    setApiKeyDialogOpen(false);
                    setNewApiKey(null);
                }}
                onCopy={copyToClipboard}
            />
        </div>
    );
}