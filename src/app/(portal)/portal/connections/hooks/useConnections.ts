"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mockConnections, generateAPIKey, maskAPIKey } from "@/services/mockData";
import { GHLConnection } from "@/types";

export function useConnections(userId?: string) {
  const [connections, setConnections] = useState<GHLConnection[]>(
    mockConnections.filter(c => c.userId === userId || userId === "1")
  );
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isConnecting, setIsConnecting] = useState(false);

  /* ------------------------- helpers ------------------------- */

  const toggleKeyVisibility = (connectionId: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      next.has(connectionId) ? next.delete(connectionId) : next.add(connectionId);
      return next;
    });
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast("Copied!", { description: "API key copied to clipboard." });
  };

  /* ------------------------- commands ------------------------- */

  const connect = async () => {
    setIsConnecting(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/authorization/init", {
        method: "GET",
        headers: {
          Accept: "*/*"
        },
      });

      if (!response.ok) {
        throw new Error("Server responded with " + response.status);
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
    }
  };

  const rotateKey = (connection: GHLConnection) => {
    const newKey = generateAPIKey("live");
    const now = new Date().toISOString();

    setConnections(prev =>
      prev.map(c => {
        if (c.id !== connection.id) return c;

        const previousKey = c.apiKey
          ? {
            maskedKey: c.apiKey.maskedKey,
            createdAt: c.apiKey.createdAt,
            revokedAt: now,
            reason: "rotated" as const,
          }
          : null;

        return {
          ...c,
          apiKey: {
            key: newKey,
            maskedKey: maskAPIKey(newKey),
            createdAt: now,
            lastUsed: null,
          },
          previousApiKeys: previousKey
            ? [...c.previousApiKeys, previousKey]
            : c.previousApiKeys,
        };
      })
    );

    toast("API Key Rotated", {
      description: "A new API key has been generated. The previous key is now inactive.",
    });

    return newKey;
  };

  const generateKey = (connection: GHLConnection) => {
    const newKey = generateAPIKey("live");
    const now = new Date().toISOString();

    setConnections(prev =>
      prev.map(c =>
        c.id === connection.id
          ? {
            ...c,
            apiKey: {
              key: newKey,
              maskedKey: maskAPIKey(newKey),
              createdAt: now,
              lastUsed: null,
            },
          }
          : c
      )
    );

    toast("API Key Generated", {
      description: "Your new API key is ready to use.",
    });

    return newKey;
  };

  const reauthorize = async (connection: GHLConnection) => {
    toast("Reauthorizing...", { description: "Redirecting to GoHighLevel..." });
    await new Promise(r => setTimeout(r, 1000));

    setConnections(prev =>
      prev.map(c =>
        c.id === connection.id
          ? { ...c, status: "active", lastSync: new Date().toISOString() }
          : c
      )
    );

    toast("Reauthorization successful", {
      description: `${connection.name} is now active.`,
    });
  };

  const disconnect = (connection: GHLConnection) => {
    setConnections(prev => prev.filter(c => c.id !== connection.id));
    toast("Connection removed", {
      description: `${connection.name} has been disconnected.`,
    });
  };

  return {
    connections,
    visibleKeys,
    isConnecting,
    connect,
    rotateKey,
    generateKey,
    reauthorize,
    disconnect,
    toggleKeyVisibility,
    copyToClipboard,
  };
}