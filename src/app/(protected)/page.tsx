import {
  ActivityIcon,
  AlertCircleIcon,
  ArrowUpRightIcon,
  Link2Icon,
  TrendingUpIcon,
  WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import { ApiUsageChart } from "@/components/dashboard/api-usage-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mockActivity,
  mockConnections,
  mockPlans,
  mockUsageData,
} from "@/services/mockData";

export default function PortalDefaultPage() {
  const userConnections = mockConnections.filter((c) => c.userId === "1");
  const activeConnections = userConnections.filter(
    (c) => c.status === "active",
  );
  const totalWebhooks = userConnections.reduce(
    (sum, c) => sum + c.webhooks.length,
    0,
  );

  const currentPlan = mockPlans.find((p) => p.id === "pro");
  const last7DaysUsage = mockUsageData.slice(-7);
  const totalCalls = last7DaysUsage.reduce((sum, d) => sum + d.calls, 0);
  const totalErrors = last7DaysUsage.reduce((sum, d) => sum + d.errors, 0);

  const stats = [
    {
      title: "Active Connections",
      value: activeConnections.length,
      total: userConnections.length,
      icon: Link2Icon,
      href: "/connections",
      color: "text-primary",
    },
    {
      title: "Configured Webhooks",
      value: totalWebhooks,
      icon: WebhookIcon,
      href: "/webhooks",
      color: "text-success",
    },
    {
      title: "API Calls (7d)",
      value: totalCalls.toLocaleString(),
      trend: "+12%",
      icon: ActivityIcon,
      href: "/usage",
      color: "text-warning",
    },
    {
      title: "Success Rate",
      value: `${((1 - totalErrors / totalCalls) * 100).toFixed(1)}%`,
      icon: TrendingUpIcon,
      href: "/usage",
      color: "text-chart-2",
    },
  ];

  const needsAttention = userConnections.filter((c) => c.status !== "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl">Welcome back, User!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your LofiConnect account
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.href} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Usage Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/usage">
                View Details <ArrowUpRightIcon className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ApiUsageChart chartData={last7DaysUsage} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockActivity.slice(0, 5).map((activity) => (
                <li key={activity.id} className="flex gap-3">
                  <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <p className="text-sm leading-tight">{activity.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {needsAttention.length > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-warning" />
              <CardTitle className="text-base">Needs Attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsAttention.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <div>
                    <p className="font-medium">{connection.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Status: {connection.status.replace("_", " ")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/connections">Fix</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/billing">Manage Billing</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className="px-3 py-1 text-lg capitalize">
              {currentPlan?.name}
            </Badge>
            <span className="font-bold text-2xl">
              ${currentPlan?.price}
              <span className="font-normal text-muted-foreground text-sm">
                /month
              </span>
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Connections</p>
              <p className="font-semibold text-lg">
                {userConnections.length} /{" "}
                {currentPlan?.limits.connections === "unlimited"
                  ? "∞"
                  : currentPlan?.limits.connections}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">
                API Calls (this period)
              </p>
              <p className="font-semibold text-lg">
                {totalCalls.toLocaleString()} /{" "}
                {currentPlan?.limits.apiCalls === "unlimited"
                  ? "∞"
                  : currentPlan?.limits.apiCalls?.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
