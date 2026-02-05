import type {
  Activity,
  FeatureFlag,
  GHLConnection,
  Invoice,
  Plan,
  Subscription,
  UsageData,
  User,
  WebhookEventType,
  WebhookSubscription,
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    createdAt: "2024-01-15T10:00:00Z",
    status: "active",
    plan: "pro",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "admin",
    createdAt: "2024-01-10T10:00:00Z",
    status: "active",
    plan: "enterprise",
  },
  {
    id: "3",
    email: "bob@example.com",
    name: "Bob Wilson",
    role: "user",
    createdAt: "2024-02-01T10:00:00Z",
    status: "suspended",
    plan: "free",
  },
];

// Mock GHL Connections (with embedded API keys)
export const mockConnections: GHLConnection[] = [
  {
    id: "conn-1",
    userId: "1",
    name: "Main Agency Account",
    locationId: "loc_abc123",
    companyId: "comp_xyz789",
    status: "active",
    apiKey: {
      key: "lc_live_sk_1234567890abcdef",
      maskedKey: "lc_live_sk_****cdef",
      createdAt: "2024-01-20T10:00:00Z",
      lastUsed: "2024-01-22T16:45:00Z",
    },
    previousApiKeys: [
      {
        maskedKey: "lc_live_sk_****5678",
        createdAt: "2024-01-10T10:00:00Z",
        revokedAt: "2024-01-20T10:00:00Z",
        reason: "rotated",
      },
    ],
    webhooks: [],
    createdAt: "2024-01-20T10:00:00Z",
    lastSync: "2024-01-22T15:30:00Z",
  },
  {
    id: "conn-2",
    userId: "1",
    name: "Client Sub-Account",
    locationId: "loc_def456",
    status: "needs_reauth",
    apiKey: {
      key: "lc_live_sk_0987654321fedcba",
      maskedKey: "lc_live_sk_****dcba",
      createdAt: "2024-01-18T10:00:00Z",
      lastUsed: "2024-01-21T12:00:00Z",
    },
    previousApiKeys: [],
    webhooks: [],
    createdAt: "2024-01-18T10:00:00Z",
    lastSync: "2024-01-21T12:00:00Z",
  },
  {
    id: "conn-3",
    userId: "1",
    name: "Test Environment",
    locationId: "loc_ghi789",
    status: "disconnected",
    apiKey: null,
    previousApiKeys: [],
    webhooks: [],
    createdAt: "2024-01-15T10:00:00Z",
    lastSync: "2024-01-19T09:00:00Z",
  },
];

// Standalone webhooks array (each webhook linked to a specific connection)
export const mockWebhooks: WebhookSubscription[] = [
  {
    id: "wh-1",
    connectionId: "conn-1",
    eventType: "ContactCreate",
    webhookUrl: "https://myapp.com/webhooks/contact-created",
    isActive: true,
    createdAt: "2024-01-21T10:00:00Z",
    lastTriggered: "2024-01-22T15:30:00Z",
    deliveryStats: { successCount: 145, failureCount: 2 },
    deliveryLogs: [
      {
        id: "log-1",
        webhookId: "wh-1",
        eventType: "ContactCreate",
        status: "success",
        statusCode: 200,
        requestPayload:
          '{"event":"ContactCreate","data":{"id":"contact_123","email":"john@example.com","firstName":"John","lastName":"Doe"}}',
        responseBody: '{"received":true}',
        errorMessage: null,
        attemptNumber: 1,
        duration: 245,
        createdAt: "2024-01-22T15:30:00Z",
      },
      {
        id: "log-2",
        webhookId: "wh-1",
        eventType: "ContactCreate",
        status: "success",
        statusCode: 200,
        requestPayload:
          '{"event":"ContactCreate","data":{"id":"contact_124","email":"jane@example.com","firstName":"Jane","lastName":"Smith"}}',
        responseBody: '{"received":true}',
        errorMessage: null,
        attemptNumber: 1,
        duration: 189,
        createdAt: "2024-01-22T14:15:00Z",
      },
      {
        id: "log-3",
        webhookId: "wh-1",
        eventType: "ContactCreate",
        status: "failed",
        statusCode: 500,
        requestPayload:
          '{"event":"ContactCreate","data":{"id":"contact_125","email":"bob@example.com","firstName":"Bob","lastName":"Wilson"}}',
        responseBody: '{"error":"Internal server error"}',
        errorMessage: "Server returned 500 status code",
        attemptNumber: 3,
        duration: 5023,
        createdAt: "2024-01-22T12:45:00Z",
      },
    ],
  },
  {
    id: "wh-2",
    connectionId: "conn-1",
    eventType: "AppointmentCreate",
    webhookUrl: "https://myapp.com/webhooks/appointment",
    isActive: true,
    createdAt: "2024-01-21T11:00:00Z",
    lastTriggered: "2024-01-22T10:00:00Z",
    deliveryStats: { successCount: 32, failureCount: 0 },
    deliveryLogs: [
      {
        id: "log-4",
        webhookId: "wh-2",
        eventType: "AppointmentCreate",
        status: "success",
        statusCode: 200,
        requestPayload:
          '{"event":"AppointmentCreate","data":{"id":"appt_001","startTime":"2024-01-23T10:00:00Z"}}',
        responseBody: '{"received":true}',
        errorMessage: null,
        attemptNumber: 1,
        duration: 312,
        createdAt: "2024-01-22T10:00:00Z",
      },
    ],
  },
];

export const webhookEventTypes: WebhookEventType[] = [
  // Contacts
  {
    key: "ContactCreate",
    name: "Contact Create",
    description: "Triggered when a new contact is created",
    category: "contacts",
  },
  {
    key: "ContactUpdate",
    name: "Contact Update",
    description: "Triggered when a contact is updated",
    category: "contacts",
  },
  {
    key: "ContactDelete",
    name: "Contact Delete",
    description: "Triggered when a contact is deleted",
    category: "contacts",
  },
  {
    key: "ContactTagUpdate",
    name: "Contact Tag Update",
    description: "Triggered when contact tags are modified",
    category: "contacts",
  },
  {
    key: "ContactDndUpdate",
    name: "Contact DND Update",
    description: "Triggered when contact DND status changes",
    category: "contacts",
  },

  // Appointments
  {
    key: "AppointmentCreate",
    name: "Appointment Create",
    description: "Triggered when an appointment is booked",
    category: "appointments",
  },
  {
    key: "AppointmentUpdate",
    name: "Appointment Update",
    description: "Triggered when an appointment is modified",
    category: "appointments",
  },
  {
    key: "AppointmentDelete",
    name: "Appointment Delete",
    description: "Triggered when an appointment is cancelled",
    category: "appointments",
  },

  // Opportunities
  {
    key: "OpportunityCreate",
    name: "Opportunity Create",
    description: "Triggered when an opportunity is created",
    category: "opportunities",
  },
  {
    key: "OpportunityUpdate",
    name: "Opportunity Update",
    description: "Triggered when an opportunity is updated",
    category: "opportunities",
  },
  {
    key: "OpportunityDelete",
    name: "Opportunity Delete",
    description: "Triggered when an opportunity is deleted",
    category: "opportunities",
  },
  {
    key: "OpportunityStatusUpdate",
    name: "Opportunity Status Update",
    description: "Triggered when opportunity status changes",
    category: "opportunities",
  },
  {
    key: "OpportunityStageUpdate",
    name: "Opportunity Stage Update",
    description: "Triggered when opportunity moves stages",
    category: "opportunities",
  },
  {
    key: "OpportunityMonetaryValueUpdate",
    name: "Opportunity Value Update",
    description: "Triggered when opportunity value changes",
    category: "opportunities",
  },

  // Invoices
  {
    key: "InvoiceCreate",
    name: "Invoice Create",
    description: "Triggered when an invoice is created",
    category: "invoices",
  },
  {
    key: "InvoiceUpdate",
    name: "Invoice Update",
    description: "Triggered when an invoice is updated",
    category: "invoices",
  },
  {
    key: "InvoicePaid",
    name: "Invoice Paid",
    description: "Triggered when an invoice is paid",
    category: "invoices",
  },
  {
    key: "InvoiceSent",
    name: "Invoice Sent",
    description: "Triggered when an invoice is sent",
    category: "invoices",
  },
  {
    key: "InvoiceVoid",
    name: "Invoice Void",
    description: "Triggered when an invoice is voided",
    category: "invoices",
  },
  {
    key: "InvoiceDelete",
    name: "Invoice Delete",
    description: "Triggered when an invoice is deleted",
    category: "invoices",
  },

  // Tasks
  {
    key: "TaskCreate",
    name: "Task Create",
    description: "Triggered when a task is created",
    category: "tasks",
  },
  {
    key: "TaskUpdate",
    name: "Task Update",
    description: "Triggered when a task is updated",
    category: "tasks",
  },
  {
    key: "TaskDelete",
    name: "Task Delete",
    description: "Triggered when a task is deleted",
    category: "tasks",
  },
  {
    key: "TaskComplete",
    name: "Task Complete",
    description: "Triggered when a task is completed",
    category: "tasks",
  },

  // Notes
  {
    key: "NoteCreate",
    name: "Note Create",
    description: "Triggered when a note is created",
    category: "notes",
  },
  {
    key: "NoteUpdate",
    name: "Note Update",
    description: "Triggered when a note is updated",
    category: "notes",
  },
  {
    key: "NoteDelete",
    name: "Note Delete",
    description: "Triggered when a note is deleted",
    category: "notes",
  },

  // Messaging
  {
    key: "InboundMessage",
    name: "Inbound Message",
    description: "Triggered when a message is received",
    category: "messaging",
  },
  {
    key: "OutboundMessage",
    name: "Outbound Message",
    description: "Triggered when a message is sent",
    category: "messaging",
  },
  {
    key: "ConversationUnreadWebhook",
    name: "Conversation Unread",
    description: "Triggered for unread conversations",
    category: "messaging",
  },

  // Location
  {
    key: "LocationCreate",
    name: "Location Create",
    description: "Triggered when a location is created",
    category: "location",
  },
  {
    key: "LocationUpdate",
    name: "Location Update",
    description: "Triggered when a location is updated",
    category: "location",
  },

  // Orders
  {
    key: "OrderCreate",
    name: "Order Create",
    description: "Triggered when an order is created",
    category: "orders",
  },
  {
    key: "OrderStatusUpdate",
    name: "Order Status Update",
    description: "Triggered when order status changes",
    category: "orders",
  },

  // Payments
  {
    key: "PaymentReceived",
    name: "Payment Received",
    description: "Triggered when a payment is received",
    category: "payments",
  },
  {
    key: "PaymentFailed",
    name: "Payment Failed",
    description: "Triggered when a payment fails",
    category: "payments",
  },

  // Forms
  {
    key: "FormSubmission",
    name: "Form Submission",
    description: "Triggered when a form is submitted",
    category: "forms",
  },

  // Surveys
  {
    key: "SurveySubmission",
    name: "Survey Submission",
    description: "Triggered when a survey is submitted",
    category: "surveys",
  },
];

// Feature Flags (admin controlled)
export const mockFeatureFlags: FeatureFlag[] = [
  // Webhook features - some published, some not
  {
    id: "f-1",
    name: "Contact Create Webhook",
    key: "webhook.ContactCreate",
    description: "Enable contact creation webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-20T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-2",
    name: "Contact Update Webhook",
    key: "webhook.ContactUpdate",
    description: "Enable contact update webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-20T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-3",
    name: "Contact Delete Webhook",
    key: "webhook.ContactDelete",
    description: "Enable contact deletion webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-20T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-4",
    name: "Appointment Create Webhook",
    key: "webhook.AppointmentCreate",
    description: "Enable appointment creation webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-20T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-5",
    name: "Appointment Update Webhook",
    key: "webhook.AppointmentUpdate",
    description: "Enable appointment update webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-20T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-6",
    name: "Opportunity Create Webhook",
    key: "webhook.OpportunityCreate",
    description: "Enable opportunity creation webhooks",
    isPublished: false,
    category: "webhook",
    updatedAt: "2024-01-18T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-7",
    name: "Opportunity Update Webhook",
    key: "webhook.OpportunityUpdate",
    description: "Enable opportunity update webhooks",
    isPublished: false,
    category: "webhook",
    updatedAt: "2024-01-18T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-8",
    name: "Invoice Paid Webhook",
    key: "webhook.InvoicePaid",
    description: "Enable invoice paid webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-19T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-9",
    name: "Inbound Message Webhook",
    key: "webhook.InboundMessage",
    description: "Enable inbound message webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-19T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-10",
    name: "Form Submission Webhook",
    key: "webhook.FormSubmission",
    description: "Enable form submission webhooks",
    isPublished: true,
    category: "webhook",
    updatedAt: "2024-01-21T10:00:00Z",
    updatedBy: "admin",
  },

  // API features
  {
    id: "f-11",
    name: "Contacts API",
    key: "api.contacts",
    description: "Access to Contacts API endpoints",
    isPublished: true,
    category: "api",
    updatedAt: "2024-01-15T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-12",
    name: "Opportunities API",
    key: "api.opportunities",
    description: "Access to Opportunities API endpoints",
    isPublished: true,
    category: "api",
    updatedAt: "2024-01-15T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-13",
    name: "Invoices API",
    key: "api.invoices",
    description: "Access to Invoices API endpoints",
    isPublished: false,
    category: "api",
    updatedAt: "2024-01-15T10:00:00Z",
    updatedBy: "admin",
  },

  // General features
  {
    id: "f-14",
    name: "Webhook Retry Logic",
    key: "feature.webhookRetry",
    description: "Automatic retry for failed webhook deliveries",
    isPublished: true,
    category: "feature",
    updatedAt: "2024-01-16T10:00:00Z",
    updatedBy: "admin",
  },
  {
    id: "f-15",
    name: "Advanced Analytics",
    key: "feature.advancedAnalytics",
    description: "Access to advanced usage analytics",
    isPublished: false,
    category: "feature",
    updatedAt: "2024-01-17T10:00:00Z",
    updatedBy: "admin",
  },
];

// Mock Usage Data (last 30 days)
export const mockUsageData: UsageData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    calls: Math.floor(Math.random() * 500) + 100,
    errors: Math.floor(Math.random() * 20),
  };
});

// Mock Plans
export const mockPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingPeriod: "monthly",
    features: [
      "1 GHL Connection",
      "1,000 API calls/month",
      "Community support",
      "Basic analytics",
    ],
    limits: {
      connections: 1,
      apiCalls: 1000,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    billingPeriod: "monthly",
    features: [
      "5 GHL Connections",
      "50,000 API calls/month",
      "Priority support",
      "Advanced analytics",
      "Webhook notifications",
    ],
    limits: {
      connections: 5,
      apiCalls: 50000,
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    billingPeriod: "monthly",
    features: [
      "Unlimited GHL Connections",
      "Unlimited API calls",
      "Dedicated support",
      "Custom analytics",
      "Webhook notifications",
      "SLA guarantee",
      "Custom integrations",
    ],
    limits: {
      connections: "unlimited",
      apiCalls: "unlimited",
    },
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    date: "2024-01-01T00:00:00Z",
    amount: 29,
    status: "paid",
    description: "Pro Plan - January 2024",
    downloadUrl: "#",
  },
  {
    id: "inv-002",
    date: "2023-12-01T00:00:00Z",
    amount: 29,
    status: "paid",
    description: "Pro Plan - December 2023",
    downloadUrl: "#",
  },
  {
    id: "inv-003",
    date: "2023-11-01T00:00:00Z",
    amount: 29,
    status: "paid",
    description: "Pro Plan - November 2023",
    downloadUrl: "#",
  },
];

// Mock Subscription
export const mockSubscription: Subscription = {
  planId: "pro",
  status: "active",
  currentPeriodStart: "2024-01-01T00:00:00Z",
  currentPeriodEnd: "2024-02-01T00:00:00Z",
  cancelAtPeriodEnd: false,
};

// Mock Recent Activity
export const mockActivity: Activity[] = [
  {
    id: "act-1",
    type: "api_call",
    message: "API call to /contacts endpoint",
    timestamp: "2024-01-22T16:45:00Z",
  },
  {
    id: "act-2",
    type: "webhook_configured",
    message: "Configured ContactCreate webhook for Main Agency Account",
    timestamp: "2024-01-22T14:30:00Z",
  },
  {
    id: "act-3",
    type: "connection_created",
    message: 'Connected GHL account "Main Agency Account"',
    timestamp: "2024-01-22T10:00:00Z",
  },
  {
    id: "act-4",
    type: "login",
    message: "Successful login from Chrome on macOS",
    timestamp: "2024-01-22T09:30:00Z",
  },
  {
    id: "act-5",
    type: "key_rotated",
    message: "API key rotated for Main Agency Account",
    timestamp: "2024-01-20T11:00:00Z",
  },
];

// Generate a new API key
export function generateAPIKey(prefix: "live" | "test" = "live"): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = `lc_${prefix}_sk_`;
  for (let i = 0; i < 24; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Mask an API key
export function maskAPIKey(key: string): string {
  const parts = key.split("_");
  const lastPart = parts[parts.length - 1];
  const maskedPart = "****" + lastPart.slice(-4);
  parts[parts.length - 1] = maskedPart;
  return parts.join("_");
}

// Get published webhook events
export function getPublishedWebhookEvents(): WebhookEventType[] {
  const publishedKeys = mockFeatureFlags
    .filter((f) => f.category === "webhook" && f.isPublished)
    .map((f) => f.key.replace("webhook.", ""));

  return webhookEventTypes.filter((e) => publishedKeys.includes(e.key));
}
