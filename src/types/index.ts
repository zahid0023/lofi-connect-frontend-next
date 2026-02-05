// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
  status: "active" | "suspended";
  plan: "free" | "pro" | "enterprise";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Key Types (embedded in connection)
export interface APIKeyInfo {
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsed: string | null;
}

export interface PreviousAPIKey {
  maskedKey: string;
  createdAt: string;
  revokedAt: string;
  reason: "rotated" | "manual_revoke";
}

// Webhook Delivery Log
export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  eventType: string;
  status: "success" | "failed" | "pending";
  statusCode: number | null;
  requestPayload: string;
  responseBody: string | null;
  errorMessage: string | null;
  attemptNumber: number;
  duration: number; // milliseconds
  createdAt: string;
}

// Webhook Types
export interface WebhookSubscription {
  id: string;
  connectionId: string; // Which connection this webhook belongs to
  eventType: string;
  webhookUrl: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
  deliveryStats: {
    successCount: number;
    failureCount: number;
  };
  deliveryLogs: WebhookDeliveryLog[];
}

// GHL Connection Types (with embedded API key)
export interface GHLConnection {
  id: string;
  userId: string;
  name: string;
  locationId: string;
  companyId?: string;
  status: "active" | "needs_reauth" | "disconnected";

  // Active API Key (only ONE per connection)
  apiKey: APIKeyInfo | null;

  // History of previous keys (for audit)
  previousApiKeys: PreviousAPIKey[];

  // Webhook subscriptions for this connection
  webhooks: WebhookSubscription[];

  createdAt: string;
  lastSync: string;
}

// Webhook Event Type Definition
export interface WebhookEventType {
  key: string;
  name: string;
  description: string;
  category:
    | "contacts"
    | "appointments"
    | "opportunities"
    | "invoices"
    | "tasks"
    | "notes"
    | "messaging"
    | "location"
    | "orders"
    | "payments"
    | "forms"
    | "surveys";
}

// Feature Flag Types
export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  isPublished: boolean;
  category: "webhook" | "api" | "feature";
  updatedAt: string;
  updatedBy: string;
}

// Usage Types
export interface UsageData {
  date: string;
  calls: number;
  errors: number;
}

export interface UsageStats {
  totalCalls: number;
  totalErrors: number;
  avgResponseTime: number;
  successRate: number;
}

export interface UsageByConnection {
  connectionId: string;
  connectionName: string;
  calls: number;
  percentage: number;
}

// Billing Types
export interface Plan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  limits: {
    connections: number | "unlimited";
    apiCalls: number | "unlimited";
  };
  popular?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  downloadUrl: string;
}

export interface Subscription {
  planId: "free" | "pro" | "enterprise";
  status: "active" | "cancelled" | "past_due";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Activity Types
export interface Activity {
  id: string;
  type:
    | "api_call"
    | "connection_created"
    | "key_created"
    | "key_rotated"
    | "webhook_configured"
    | "plan_upgraded"
    | "login";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
