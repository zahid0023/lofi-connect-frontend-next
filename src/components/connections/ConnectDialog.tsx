"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isConnecting: boolean;
    appKeyId?: string;
}

export function ConnectDialog({ open, onOpenChange, isConnecting, appKeyId }: Props) {

    const handleConnect = () => {
        window.location.href =
            `http://localhost:8080/api/v1/authorization/init?app-key-id=${appKeyId}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect GoHighLevel Account</DialogTitle>
                    <DialogDescription>
                        You'll be redirected to GoHighLevel to authorize the connection against this API Key.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConnect} disabled={isConnecting}>
                        Connect with GHL
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}