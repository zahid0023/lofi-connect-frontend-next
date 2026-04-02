"use client";

import { useState } from "react";
import { useApiKeys } from "./hooks/useApiKeys";
import { ApiKeyDialog } from "./components/ApiKeyDialog";
import { ApiKeyList } from "./components/ApiKeyList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ConnectionsPage() {
    const {
        apiKeys,
        isLoading,
        handleCreate,
        handleDelete,
        copyToClipboard,
    } = useApiKeys();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [plainKey, setPlainKey] = useState<string | null>(null);

    const onCreateSubmit = async (name: string) => {
        const key = await handleCreate(name);
        if (key) {
            setCreateDialogOpen(false);
            setPlainKey(key);
        }
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
                onDeleteKey={handleDelete}
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
