"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { AppKeyDialog } from '@/components/connections/AppKeyDialog';
import { ApiKeyDialog } from '@/components/connections/ApiKeyDialog';
import { AppKeyList } from '@/components/connections/app-key-list';
import { AppKeyInfo } from '@/components/connections/app-key-card';
import { AppKeyApi } from '@/lib/api/endpoints/app-key';
import { ConnectDialog } from '@/components/connections/ConnectDialog';
import { ConnectionInfoDialog } from '@/components/connections/ConnectInfoDialog';

export default function ConnectionsPage() {
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [showKeyDialog, setShowKeyDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [appKeys, setAppKeys] = useState<AppKeyInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedKey, setSelectedKey] = useState<AppKeyInfo | null>(null);
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    const [connectOpen, setConnectOpen] = useState(false);


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
    };

    const handleConnectClick = (key: AppKeyInfo) => {
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


                {/* Name Input Dialog */}
                <AppKeyDialog
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
                <AppKeyList
                    appKeys={appKeys}
                    onConnectClick={handleConnectClick}
                />
            </div>

            <ConnectDialog
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
