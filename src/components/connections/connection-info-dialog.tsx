"use client";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApiKeyInfo } from "@/components/connections/api-key-card";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    keyInfo: ApiKeyInfo | null;
}

export function ConnectionInfoDialog({ open, onOpenChange, keyInfo }: Props) {

    const conn = keyInfo?.ghlConnection;

    if (!conn) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>GHL Connection Info</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 text-sm">
                    <p><b>Company ID:</b> {conn.companyId}</p>
                    <p><b>Agency:</b> {conn.isAgency ? "Yes" : "No"}</p>
                    {
                        !conn.isAgency && (
                            <p><b>Sub Account:</b> {conn.subAccountName} ({conn.subAccountId})</p>
                        )
                    }
                    <p><b>User ID:</b> {conn.userId}</p>
                    <p><b>Scopes:</b> {conn.scopes}</p>

                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}