"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { ApiKeyDialog } from '@/components/connections/api-key-dialog';
import { AppKeyApi } from '@/lib/api/endpoints/app-key';
import { ConnectionInfoDialog } from '@/components/connections/connection-info-dialog';
import { toast } from 'sonner';
import { CreateApiKeyDialog } from '@/components/connections/create-api-key-dialog';
import { ApiKeyInfo } from '@/components/connections/api-key-card';
import { ApiKeyList } from '@/components/connections/api-key-list';
import { GHLConnectDialog } from '@/components/connections/ghl-connect-dialog';

export default function ConnectionsPage() {
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [showKeyDialog, setShowKeyDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [appKeys, setAppKeys] = useState<ApiKeyInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedKey, setSelectedKey] = useState<ApiKeyInfo | null>(null);
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    const keys = async () => {
        try {
            const data = await AppKeyApi.list();
            setAppKeys(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        keys();
    }, []);

    const handleKeyGenerated = (key: string) => {
        setGeneratedKey(key);
        setShowKeyDialog(true);

        // reload list after creating key
        keys();
    };

    const handleCloseKeyDialog = () => {
        setShowKeyDialog(false);

        // wipe secret from memory immediately
        setGeneratedKey(null);
    };

    const handleCopy = async (key: string) => {
        await navigator.clipboard.writeText(key);
        toast.success("API key copied to clipboard!");
    };

    const handleConnectClick = (key: ApiKeyInfo) => {
        setSelectedKey(key);

        if (key.ghlConnection) {
            setShowInfoDialog(true);
        } else {
            setShowConnectDialog(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Connections</h1>
                    <p className="text-muted-foreground">
                        Manage your GoHighLevel account connections and API keys
                    </p>
                </div>

                <Button
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Key className="h-4 w-4" />
                    Create App Key
                </Button>


                {/* Create Api Key and Name Input Dialog */}
                <CreateApiKeyDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSuccess={handleKeyGenerated}
                />

                {/* One-Time Secret Dialog */}
                <ApiKeyDialog
                    open={showKeyDialog}
                    apiKey={generatedKey}
                    onClose={handleCloseKeyDialog}
                    onCopy={handleCopy}
                />
            </div>

            {/* App Keys List */}
            <div>
                <ApiKeyList
                    appKeys={appKeys}
                    onConnectClick={handleConnectClick}
                />
            </div>

            <GHLConnectDialog
                open={showConnectDialog}
                onOpenChange={setShowConnectDialog}
                isConnecting={false}
                appKeyId={selectedKey?.id}
            />

            <ConnectionInfoDialog
                open={showInfoDialog}
                onOpenChange={setShowInfoDialog}
                keyInfo={selectedKey}
            />
        </div>
    );
}
