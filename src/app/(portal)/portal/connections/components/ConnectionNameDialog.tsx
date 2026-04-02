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
import { Label } from "@/components/ui/label";
import { AlertTriangle, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    initialName?: string;
    code: string | null;
    onClose: () => void;
    onSuccess?: (appKey: string) => void;
    onSubmit: (name: string) => void;
}

export function ConnectionNameDialog({ open, initialName, code, onClose, onSuccess, onSubmit }: Props) {
    const [name, setName] = useState(initialName || "");
    const [loading, setLoading] = useState(false);

    // Update local state if initialName changes (for editing different connections)
    useEffect(() => {
        setName(initialName || "");
    }, [initialName]);

    if (!open) return null;

    const handleActivate = async () => {
        if (!name.trim()) {
            toast("Connection Name Required", {
                description: "Please enter a name for this connection"
            });
            return;
        }

        if (!code) {
            toast("Error", {
                description: "Authorization code is missing"
            });
            return;
        }

        try {
            setLoading(true);

            const url = new URL("http://localhost:8080/api/v1/authorization/activate");
            url.searchParams.append("code", code);
            url.searchParams.append("connection-name", name);

            const res = await fetch(url.toString(), {
                method: "PUT",
                headers: {
                    Accept: "*/*"
                },
            });

            if (!res.ok) {
                throw new Error("Connection Activation Unsuccessful :" + res.status);
            }

            const data = await res.json();
            const appKey = data?.data?.app_key || "";

            toast("Connection Activation Successful", {
                description: "Your connection " + name + " has been activated with app key: " + appKey + "!!",
            });

            onSuccess?.(appKey);
            onClose();
            setName("");
        } catch (err: any) {
            console.error(err);
            toast("Error", {
                description: err?.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name.trim());
    };

    console.log(code);

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        {initialName ? "Edit Connection Name" : "Connection Name"}
                    </DialogTitle>
                    <DialogDescription>
                        <span className="flex items-center gap-2 text-warning">
                            <AlertTriangle className="h-4 w-4" />
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Connection Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Main Agency Account"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        A friendly name to identify this connection
                                    </p>
                                </div>
                            </div>
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {
                        initialName ?
                            <Button
                                onClick={handleSubmit}
                            >
                                Save
                            </Button> :
                            <Button
                                onClick={handleActivate}
                                disabled={loading}
                            >
                                {loading ? "Activating..." : "Get API Key"}
                            </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}