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
import { Input } from "@/components/ui/input";
import { AppKeyApi } from "@/lib/api/endpoints/app-key";
import { AlertTriangle, Key } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    initialName?: string;
    onClose: () => void;
    onSuccess: (generatedKey: string) => void;
}

export function CreateApiKeyDialog({ open, initialName, onClose, onSuccess }: Props) {
    const [name, setName] = useState(initialName || "");
    const [loading, setLoading] = useState(false);

    // Update local state if initialName changes (for editing different connections)
    useEffect(() => {
        setName(initialName || "");
    }, [initialName]);

    if (!open) return null;

    const handleGenerate = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);

            const response = await AppKeyApi.generate({
                name: name.trim(),
            });

            // send generated secret to parent
            onSuccess(response.appKey);

            // You may want to show a success dialog here
            onClose();

        } catch (error) {
            console.error("Failed to generate key", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose();   // closes on ESC or outside click
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        {initialName ? "Edit Api Key Name" : "Api Key Name"}
                    </DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center gap-2 text-warning">
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Input
                                        id="name"
                                        placeholder="e.g., Api Key 1"
                                        value={name}
                                        onChange={event => setName(event.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        A friendly name to identify this api key
                                    </p>

                                    <div className="flex items-center gap-2 mt-4 text-warning text-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        The generated key will only be shown once.
                                    </div>
                                </div>
                            </div>
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}>
                        Cancel
                    </Button>
                    {
                        initialName ?
                            <Button
                            >
                                Save
                            </Button> :
                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? "Getting Api Key" : "Get API Key"}
                            </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}