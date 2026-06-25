"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, Copy, Key } from "lucide-react";

interface Props {
    open: boolean;
    apiKey: string | null;
    onClose: () => void;
    onCopy: (key: string) => void;
    onCreate?: (name: string) => Promise<void>;
}

export function ApiKeyDialog({ open, apiKey, onClose, onCopy, onCreate }: Props) {
    const [name, setName] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setName("");
        setCopied(false);
        setError(null);
        onClose();
    };

    const handleCreate = async () => {
        if (!name.trim() || !onCreate) return;
        setError(null);
        setIsLoading(true);
        try {
            await onCreate(name.trim());
            // parent closes the dialog on success — don't clear name here
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Create mode
    if (!apiKey) {
        return (
            <Dialog open={open} onOpenChange={o => !o && handleClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            Create New API Key
                        </DialogTitle>
                        <DialogDescription>
                            Give your API key a name to identify it later.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input
                            id="key-name"
                            placeholder="e.g. Production, My App"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(null); }}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            disabled={isLoading}
                        />
                        {error && (
                            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={!name.trim() || isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Creating...
                                </span>
                            ) : (
                                <>
                                    <Key className="mr-2 h-4 w-4" />
                                    Create API Key
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Show mode — display the plain key once after creation
    return (
        <Dialog open={open} onOpenChange={o => !o && handleClose()}>
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
                        <Button variant="ghost" size="icon" onClick={() => { onCopy(apiKey); setCopied(true); }}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Store this key securely. You won't be able to see it again. If you lose it, you'll need to generate a new one.
                    </p>
                </div>

                <DialogFooter>
                    <Button onClick={handleClose} disabled={!copied}>I've saved my key</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
