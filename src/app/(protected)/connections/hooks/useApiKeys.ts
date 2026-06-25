"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiKey, createApiKey, getApiKeys } from "@/services/apiKeys";

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /* ── fetch ── */

    const fetchApiKeys = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getApiKeys();
            setApiKeys(data ?? []);
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

    // Returns the plain key (app_key) to show once in the dialog.
    // Always throws on error so callers can handle each case.
    const handleCreate = async (name: string): Promise<string | null> => {
        const apiKey = await createApiKey({ name });
        setApiKeys(prev => [apiKey, ...prev]);
        toast.success("API key created");
        return apiKey.app_key;
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
        copyToClipboard,
    };
}
