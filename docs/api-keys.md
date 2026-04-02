# API Keys — Developer Documentation

## Overview

API keys allow users to authenticate with the Lofi Connect platform programmatically. This document covers the full stack of the API key feature: the base HTTP client, the service layer, and the React hook.

---

## File Structure

```
src/
├── services/
│   ├── api.ts          # Base HTTP client (all requests go through here)
│   └── apiKeys.ts      # API key endpoints + TypeScript types
└── app/(portal)/portal/connections/
    └── hooks/
        └── useApiKeys.ts   # React hook — use this in components
```

---

## Environment Setup

Add the following to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Change the value to your backend's base URL for staging or production.

---

## Base HTTP Client — `src/services/api.ts`

A thin wrapper around the native `fetch` API. All requests go through `apiFetch`, which:

- Prepends `NEXT_PUBLIC_API_URL` to every path
- Sets `Content-Type: application/json` by default
- Throws an `Error` with the response body if the status is not `ok`
- Returns `undefined` for `204 No Content` responses

### Methods

```ts
api.get<T>(path, options?)           // GET
api.post<T>(path, body, options?)    // POST
api.put<T>(path, body, options?)     // PUT
api.patch<T>(path, body, options?)   // PATCH
api.delete<T>(path, options?)        // DELETE
```

All methods are fully typed and return `Promise<T>`.

---

## API Keys Service — `src/services/apiKeys.ts`

### Types

```ts
interface ApiKey {
    id: string;
    name: string;
    maskedKey: string;          // e.g. "live_••••••••abcd"
    createdAt: string;          // ISO 8601
    lastUsed: string | null;    // ISO 8601 or null
    status: "active" | "revoked";
}

interface CreateApiKeyRequest {
    name: string;
}

interface CreateApiKeyResponse {
    apiKey: ApiKey;
    plainKey: string;   // ⚠️ only returned once — show immediately and discard
}

interface UpdateApiKeyRequest {
    name?: string;
    status?: "active" | "revoked";
}

interface RotateApiKeyResponse {
    apiKey: ApiKey;
    plainKey: string;   // ⚠️ only returned once — show immediately and discard
}
```

### Endpoints

#### `getApiKeys()` — List all API keys
```ts
GET /api-keys

// Usage
const keys = await getApiKeys();
// Returns: ApiKey[]
```

---

#### `getApiKey(id)` — Get a single API key
```ts
GET /api-keys/:id

// Usage
const key = await getApiKey("key_123");
// Returns: ApiKey
```

---

#### `createApiKey(body)` — Create a new API key
```ts
POST /api-keys
Body: { name: string }

// Usage
const { apiKey, plainKey } = await createApiKey({ name: "Production" });
// Returns: CreateApiKeyResponse
// ⚠️ plainKey is only returned here — display it to the user immediately
```

---

#### `updateApiKey(id, body)` — Rename a key (full update)
```ts
PUT /api-keys/:id
Body: { name?: string; status?: "active" | "revoked" }

// Usage
const updated = await updateApiKey("key_123", { name: "Staging" });
// Returns: ApiKey
```

---

#### `patchApiKey(id, body)` — Partial update (e.g. revoke)
```ts
PATCH /api-keys/:id
Body: { name?: string; status?: "active" | "revoked" }

// Usage
const updated = await patchApiKey("key_123", { status: "revoked" });
// Returns: ApiKey
```

---

#### `rotateApiKey(id)` — Invalidate old key and issue a new one
```ts
POST /api-keys/:id/rotate

// Usage
const { apiKey, plainKey } = await rotateApiKey("key_123");
// Returns: RotateApiKeyResponse
// ⚠️ plainKey is only returned here — display it to the user immediately
```

---

#### `deleteApiKey(id)` — Permanently delete a key
```ts
DELETE /api-keys/:id

// Usage
await deleteApiKey("key_123");
// Returns: void (204 No Content)
```

---

## React Hook — `useApiKeys`

`useApiKeys` wraps the service layer with React state, loading flags, and toast notifications. **Always use this hook in components — never call service functions directly.**

### Usage

```tsx
import { useApiKeys } from "@/app/(portal)/portal/connections/hooks/useApiKeys";

function MyComponent() {
    const {
        apiKeys,
        isLoading,
        handleCreate,
        handleRename,
        handleRevoke,
        handleRotate,
        handleDelete,
        copyToClipboard,
    } = useApiKeys();
}
```

### Returns

| Name | Type | Description |
|---|---|---|
| `apiKeys` | `ApiKey[]` | Current list of API keys, fetched on mount |
| `isLoading` | `boolean` | `true` while the initial fetch is in progress |
| `fetchApiKeys` | `() => Promise<void>` | Manually re-fetch the list |
| `handleCreate` | `(name: string) => Promise<string \| null>` | Create a key — returns `plainKey` or `null` on error |
| `handleRename` | `(id, name) => Promise<void>` | Rename a key via PUT |
| `handleRevoke` | `(id) => Promise<void>` | Set status to `"revoked"` via PATCH |
| `handleRotate` | `(id) => Promise<string \| null>` | Rotate a key — returns new `plainKey` or `null` on error |
| `handleDelete` | `(id) => Promise<void>` | Permanently delete a key |
| `copyToClipboard` | `(key: string) => Promise<void>` | Copy a key string to the clipboard with a toast confirmation |

### Example — Create and show the plain key

```tsx
const { handleCreate } = useApiKeys();

const onSubmit = async (name: string) => {
    const plainKey = await handleCreate(name);
    if (plainKey) {
        // Show plainKey in a one-time dialog — it cannot be retrieved again
        setNewKey(plainKey);
        setDialogOpen(true);
    }
};
```

### Example — Rotate and show the new plain key

```tsx
const { handleRotate } = useApiKeys();

const onRotate = async (id: string) => {
    const plainKey = await handleRotate(id);
    if (plainKey) {
        setNewKey(plainKey);
        setDialogOpen(true);
    }
};
```

---

## Important Notes

- **Plain keys are only returned once** — at creation and rotation. You must display the key to the user immediately and instruct them to save it. It cannot be retrieved again.
- **Errors** are caught inside the hook and shown as toast notifications. The hook functions return `null` (for functions that return a value) or resolve silently on failure — no need to wrap calls in try/catch in your components.
- **State is local** — the hook manages an in-memory list. After creating, rotating, or deleting, the list is updated optimistically without re-fetching.
