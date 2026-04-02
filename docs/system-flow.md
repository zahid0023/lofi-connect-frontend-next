# System Flow Documentation

## Overview

Lofi Connect is a Next.js frontend that allows users to manage API keys and connect their GoHighLevel (GHL) accounts. This document describes the full system flow from authentication through API key management and CRM integration.

---

## Architecture

```
Browser
  └── Next.js App (App Router)
        ├── Auth layer         → src/services/auth.ts
        ├── HTTP client        → src/services/api.ts
        ├── Domain services    → src/services/apiKeys.ts
        │                         src/services/connections.ts
        ├── React hooks        → hooks/useApiKeys.ts
        └── UI components      → components/, layouts/
```

---

## 1. Authentication Flow

### Login

```
LoginForm
  → login({ user_name, password })   [src/services/auth.ts]
  → POST /auth/login
  ← { token_type, access_token, refresh_token }
  → setToken(access_token)           stored as "access_token" in localStorage
  → localStorage "loficonnect_refresh_token" = refresh_token
  → router.push("/portal")
```

### Token Usage

Every subsequent API call goes through `api.ts`, which reads `access_token` from localStorage and attaches it automatically:

```
api.get/post/put/patch/delete(path)
  → reads localStorage["access_token"]
  → sets Authorization: Bearer <token>
  → fetch(BASE_URL + path, { headers })
  ← response.json()  |  throws Error if !res.ok
```

`BASE_URL` is read from `NEXT_PUBLIC_API_URL` in `.env.local`.

### Token Refresh

```
refreshToken()                       [src/services/auth.ts]
  → reads "loficonnect_refresh_token" from localStorage
  → POST /auth/refresh { refresh_token }
  ← { access_token, ... }
  → setToken(new access_token)
```

### Logout

```
Sidebar "Log out" button
  → logout()                         [src/services/auth.ts]
  → clears "access_token" from localStorage
  → clears "loficonnect_refresh_token" from localStorage
  → router.push("/login")
```

---

## 2. API Key Management Flow

### Data Model

```ts
ApiKey {
  id                    // numeric key ID
  app_key               // plain text key — only present at creation / rotation
  masked_key            // e.g. "b5a5****aa36" — always present
  name                  // user-defined label
  status                // "active" | "revoked"
  created_at / updated_at
  subscription_plan_name
  ghl_connection        // GhlConnection | null  (see section 3)
}
```

### State Management

`useApiKeys` hook (`hooks/useApiKeys.ts`) owns all API key state:

```
mount → fetchApiKeys() → GET /app-keys → setApiKeys([...])
```

All mutations update local state immediately after a successful API call — no full re-fetch needed.

### Create API Key

```
"Create New API Key" button (page header or ApiKeyList empty state)
  → setCreateDialogOpen(true)
  → ApiKeyDialog [Create mode]
      └── user types name → clicks "Create API Key"
  → handleCreate(name)              [useApiKeys]
  → POST /app-keys/generate { name }
  ← { data: ApiKey }                ← app_key is plain text here
  → prepend to apiKeys state
  → setCreateDialogOpen(false)
  → setPlainKey(app_key)            ← triggers show dialog
  → ApiKeyDialog [Show mode]
      └── user copies key → "I've saved my key" (enabled only after copy)
      → setPlainKey(null)           ← key cleared from memory
```

> ⚠️ `app_key` is only returned once — at creation. After this point, only `masked_key` is available from the API.

### Show / Hide Key in Card

```
ApiKeyCard eye button
  → toggles local "visible" state
  → if visible && app_key exists → show app_key
  → else → show masked_key
  (eye button disabled when app_key is not in state)
```

### Copy Key

```
ApiKeyCard copy button
  → onCopy(app_key || masked_key)
  → navigator.clipboard.writeText(key)
  → toast "Copied!"
```

### Rename API Key

```
handleRename(id, name)              [useApiKeys]
  → PUT /app-keys/:id { name }
  ← updated ApiKey
  → update in apiKeys state
```

### Revoke API Key

```
handleRevoke(id)                    [useApiKeys]
  → PATCH /app-keys/:id { status: "revoked" }
  ← updated ApiKey
  → update in apiKeys state
  → card badge changes to "revoked"
```

### Rotate API Key

```
handleRotate(id)                    [useApiKeys]
  → POST /app-keys/:id/rotate
  ← { data: ApiKey }                ← new app_key in response
  → update in apiKeys state
  → return new app_key              ← caller shows it in ApiKeyDialog
```

### Delete API Key

```
ApiKeyCard delete button
  → handleDelete(id)                [useApiKeys]
  → DELETE /app-keys/:id
  ← 204 No Content
  → remove from apiKeys state
```

---

## 3. GHL Connection Flow

### Initiating the Connection

```
ApiKeyCard → Connect dropdown → "Connect to GHL"
  → initGhlConnection(apiKey.id)    [src/services/connections.ts]
  → window.location.href =
      BASE_URL + "/authorization/ghl/init?app-key-id={id}"
  ← backend redirects browser to GHL OAuth page
  ← user authorizes on GHL
  ← GHL redirects back to the app callback URL
```

> The browser navigates directly (no fetch) to avoid CORS issues. No Authorization header is required for this endpoint.

### Connection State in the Card

After the OAuth flow completes, the `ghl_connection` field is populated on subsequent `GET /app-keys` calls:

```
ghl_connection: null
  → XCircle icon  +  "Not connected" badge

ghl_connection: { ... }
  → CheckCircle2 icon  +  "Connected" badge
  → Shows: sub_account_name, user_id, sub_account_id
  → Agency badge if is_agency === true
  → Scopes rendered as individual badges
```

The **Connect to GHL** dropdown item also shows a green `CheckCircle2` when already connected.

---

## 4. Component Hierarchy

```
ConnectionsPage  (page.tsx)
  ├── ApiKeyList  (ApiKeyList.tsx)
  │     └── ApiKeyCard × n  (ApiKeyCard.tsx)
  │           ├── Connect dropdown → initGhlConnection()
  │           ├── Eye toggle       → show/hide app_key
  │           ├── Copy button      → clipboard
  │           ├── Delete button    → handleDelete()
  │           └── GHL connection panel
  ├── ApiKeyDialog [Create mode]   — name input
  └── ApiKeyDialog [Show mode]     — one-time plain key display
```

---

## 5. File Reference

| File | Responsibility |
|---|---|
| `src/services/api.ts` | Base HTTP client, token injection |
| `src/services/auth.ts` | Login, logout, token refresh |
| `src/services/apiKeys.ts` | All `/app-keys` endpoints + types |
| `src/services/connections.ts` | GHL OAuth init redirect |
| `hooks/useApiKeys.ts` | API key state, all mutations |
| `components/ApiKeyCard.tsx` | Single key card UI |
| `components/ApiKeyList.tsx` | List with loading/empty states |
| `components/ApiKeyDialog.tsx` | Create + one-time show dialog |
| `layouts/portal-sidebar.tsx` | Nav + logout |
| `src/contexts/AuthContext.tsx` | Auth state context (mock — to be replaced with real backend) |
| `.env.local` | `NEXT_PUBLIC_API_URL` base URL |

---

## 6. Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL including version prefix | `http://localhost:8080/api/v1` |

---

## 7. LocalStorage Keys

| Key | Value | Set by |
|---|---|---|
| `access_token` | JWT access token | `auth.ts` → `setToken()` |
| `loficonnect_refresh_token` | JWT refresh token | `auth.ts` → `login()` |
| `loficonnect_auth` | User object (mock auth) | `AuthContext` |
