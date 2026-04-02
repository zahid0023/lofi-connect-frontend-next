"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    ApiKey,
    createApiKey,
    deleteApiKey,
    getApiKeys,
    patchApiKey,
    rotateApiKey,
    updateApiKey,
} from "@/services/apiKeys";

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /* ── fetch ── */

    const fetchApiKeys = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getApiKeys();
            setApiKeys(data);
        } catch {
            toast.error("Failed to load API keys");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApiKeys();
    }, [fetchApiKeys]);

    /* ── create ── */

    // Returns the plain key (app_key) to show once in the dialog
    const handleCreate = async (name: string): Promise<string | null> => {
        try {
            const apiKey = await createApiKey({ name });
            setApiKeys(prev => [apiKey, ...prev]);
            toast.success("API key created");
            return apiKey.app_key;
        } catch {
            toast.error("Failed to create API key");
            return null;
        }
    };

    /* ── rename (PUT) ── */

    const handleRename = async (id: number, name: string) => {
        try {
            const updated = await updateApiKey(id, { name });
            setApiKeys(prev => prev.map(k => k.id === id ? updated : k));
            toast.success("API key renamed");
        } catch {
            toast.error("Failed to rename API key");
        }
    };

    /* ── revoke (PATCH) ── */

    const handleRevoke = async (id: number) => {
        try {
            const updated = await patchApiKey(id, { status: "revoked" });
            setApiKeys(prev => prev.map(k => k.id === id ? updated : k));
            toast.success("API key revoked");
        } catch {
            toast.error("Failed to revoke API key");
        }
    };

    /* ── rotate ── */

    const handleRotate = async (id: number): Promise<string | null> => {
        try {
            const apiKey = await rotateApiKey(id);
            setApiKeys(prev => prev.map(k => k.id === id ? apiKey : k));
            toast.success("API key rotated");
            return apiKey.app_key;
        } catch {
            toast.error("Failed to rotate API key");
            return null;
        }
    };

    /* ── delete ── */

    const handleDelete = async (id: number) => {
        try {
            await deleteApiKey(id);
            setApiKeys(prev => prev.filter(k => k.id !== id));
            toast.success("API key deleted");
        } catch {
            toast.error("Failed to delete API key");
        }
    };

    /* ── clipboard ── */

    const copyToClipboard = async (key: string) => {
        await navigator.clipboard.writeText(key);
        toast("Copied!", { description: "API key copied to clipboard." });
    };

    return {
        apiKeys,
        isLoading,
        fetchApiKeys,
        handleCreate,
        handleRename,
        handleRevoke,
        handleRotate,
        handleDelete,
        copyToClipboard,
    };
}
