"use client";

import { useState } from "react";
import { useApiKeys } from "./hooks/useApiKeys";
import { ApiKeyDialog } from "./components/ApiKeyDialog";
import { ApiKeyList } from "./components/ApiKeyList";
import { SubscribeDialog } from "./components/SubscribeDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApiError } from "@/services/api";

export default function ConnectionsPage() {
    const {
        apiKeys,
        isLoading,
        handleCreate,
        copyToClipboard,
    } = useApiKeys();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [plainKey, setPlainKey] = useState<string | null>(null);

    const onCreateSubmit = async (name: string) => {
        try {
            const key = await handleCreate(name);
            if (key) {
                setCreateDialogOpen(false);
                setPlainKey(key);
            }
        } catch (err) {
            const isNoSubscription =
                err instanceof ApiError && (err.code === "NO_ACTIVE_SUBSCRIPTION" || err.status === 422);
            if (isNoSubscription) {
                setCreateDialogOpen(false);
                setSubscribeDialogOpen(true);
            } else {
                throw err; // let ApiKeyDialog display the error message inline
            }
        }
    };

    const onSubscribed = () => {
        setSubscribeDialogOpen(false);
        setCreateDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">API Keys</h1>
                    <p className="text-muted-foreground">
                        Manage API keys for your GoHighLevel connections
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New API Key
                </Button>
            </div>

            <ApiKeyList
                apiKeys={apiKeys}
                isLoading={isLoading}
                onCopy={copyToClipboard}
                onCreateKey={() => setCreateDialogOpen(true)}
            />

            {/* Subscribe dialog — shown when backend rejects with no-subscription error */}
            <SubscribeDialog
                open={subscribeDialogOpen}
                onClose={() => setSubscribeDialogOpen(false)}
                onSubscribed={onSubscribed}
            />

            {/* Create — name input */}
            <ApiKeyDialog
                open={createDialogOpen}
                apiKey={null}
                onCreate={onCreateSubmit}
                onClose={() => setCreateDialogOpen(false)}
                onCopy={copyToClipboard}
            />

            {/* Show plain key once after creation */}
            <ApiKeyDialog
                open={!!plainKey}
                apiKey={plainKey}
                onClose={() => setPlainKey(null)}
                onCopy={copyToClipboard}
            />
        </div>
    );
}
