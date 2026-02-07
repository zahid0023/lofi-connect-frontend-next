"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Copy, Key } from "lucide-react";

interface Props {
    open: boolean;
    apiKey: string | null;
    onClose: () => void;
    onCopy: (key: string) => void;
}

export function ApiKeyDialog({ open, apiKey, onClose, onCopy }: Props) {
    if (!apiKey) return null;

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        Your API Key
                    </DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center gap-2 text-warning">
                            <AlertTriangle className="h-4 w-4" />
                            This key will only be shown once. Copy it now!
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2 rounded-lg border bg-muted p-3 font-mono text-sm">
                        <code className="flex-1 break-all">{apiKey}</code>
                        <Button variant="ghost" size="icon" onClick={() => onCopy(apiKey)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Store this key securely. You won't be able to see it again. If you lose it, you'll need to generate a new one.
                    </p>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>I've saved my key</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}