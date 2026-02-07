"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Plus, RefreshCw } from "lucide-react";

interface Props {
    isConnecting: boolean;
}

export function ConnectDialog({ isConnecting }: Props) {
    const [open, setOpen] = useState(false);

    const handleConnect = () => {
        // Redirect the user to the backend /init endpoint
        window.location.href = "http://localhost:8080/api/v1/authorization/init";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Connect Account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect GoHighLevel Account</DialogTitle>
                    <DialogDescription>
                        You'll be redirected to GoHighLevel to authorize the connection. An API key will be automatically generated.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConnect} disabled={isConnecting}>
                        {isConnecting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Connect with GHL
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}