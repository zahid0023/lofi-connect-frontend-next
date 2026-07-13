"use client";

import {
  Activity,
  AlertCircle,
  Download,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMyStats,
  getMyDailyUsage,
  getUsageByConnection,
  type UsageStatsResponse,
  type DailyUsagePoint,
  type ConnectionUsageItem,
} from "@/services/usageLogs";

const ICON_MAP = {
  Zap: Zap,
  TrendingUp: TrendingUp,
  AlertCircle: AlertCircle,
  Activity: Activity,
} as const;

function timeRangeToRange(timeRange: string): number {
  switch (timeRange) {
    case "24h": return 1;
    case "30d": return 30;
    default: return 7;
  }
}

export default function UsagePage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [stats, setStats] = useState<UsageStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyUsagePoint[]>([]);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [connectionData, setConnectionData] = useState<ConnectionUsageItem[]>([]);
  const [connectionLoading, setConnectionLoading] = useState(true);

  useEffect(() => {
    const range = timeRangeToRange(timeRange);
    setStatsLoading(true);
    setDailyLoading(true);
    setConnectionLoading(true);
    getMyStats(range)
      .then(setStats)
      .catch(() => toast.error("Failed to load usage stats"))
      .finally(() => setStatsLoading(false));
    getMyDailyUsage(range)
      .then((res) => setDailyData(res.data))
      .catch(() => toast.error("Failed to load daily usage"))
      .finally(() => setDailyLoading(false));
    getUsageByConnection(range)
      .then((res) => setConnectionData(res.data))
      .catch(() => toast.error("Failed to load usage by connection"))
      .finally(() => setConnectionLoading(false));
  }, [timeRange]);

  const usageByConnection = connectionData
    .map((item) => ({
      name: item.app_key_name,
      calls: item.total_calls,
    }))
    .sort((a, b) => b.calls - a.calls);

  // Build stat card rows from API data
  const statCards = stats
    ? [
        {
          title: "Total API Calls",
          value: Math.round(stats.total_calls.value).toLocaleString(),
          card: stats.total_calls,
          isErrorCard: false,
        },
        {
          title: "Success Rate",
          value: `${stats.success_rate.value.toFixed(1)}%`,
          card: stats.success_rate,
          isErrorCard: false,
        },
        {
          title: "Errors",
          value: Math.round(stats.errors.value).toLocaleString(),
          card: stats.errors,
          isErrorCard: true,
        },
        {
          title: "Avg Calls / Day",
          value: stats.avg_calls_per_day.value.toFixed(1),
          card: stats.avg_calls_per_day,
          isErrorCard: false,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl">Usage Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your API usage and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-7 w-20 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          : statCards.map(({ title, value, card, isErrorCard }) => {
              const IconComp =
                ICON_MAP[card.icon as keyof typeof ICON_MAP] ?? Activity;
              const hasChange = card.change_percentage !== null;
              const isUp = card.trend === "UP";
              // For errors card: DOWN trend is good (green), UP is bad (red)
              const isBadge =
                hasChange && card.trend !== "NEUTRAL";
              const badgeGreen = isErrorCard ? !isUp : isUp;

              return (
                <Card key={title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="font-medium text-muted-foreground text-sm">
                      {title}
                    </CardTitle>
                    <IconComp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="font-bold text-2xl">{value}</div>
                      {isBadge && (
                        <Badge
                          variant="secondary"
                          className={
                            badgeGreen ? "text-success" : "text-destructive"
                          }
                        >
                          {isUp ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {card.change_percentage !== null &&
                            `${card.change_percentage > 0 ? "+" : ""}${card.change_percentage.toFixed(1)}%`}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Calls Over Time</CardTitle>
            <CardDescription>Daily API calls and errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {dailyLoading ? (
                <div className="flex h-full items-center justify-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="api_calls"
                      name="API Calls"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      name="Errors"
                      stroke="var(--destructive)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Connection</CardTitle>
            <CardDescription>API calls breakdown per app key</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {connectionLoading ? (
                <div className="flex h-full items-center justify-center">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
              ) : usageByConnection.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No connection data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageByConnection} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis type="number" className="text-xs" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      className="text-xs"
                      tickFormatter={(v) =>
                        v.length > 15 ? `${v.slice(0, 15)}...` : v
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar
                      dataKey="calls"
                      fill="var(--primary)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
            <CardDescription>Per-key stats and connection info</CardDescription>
          </CardHeader>
          <CardContent>
            {connectionLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : connectionData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No app keys found.</p>
            ) : (
              <div className="space-y-3">
                {connectionData.map((item) => (
                  <div
                    key={item.app_key_id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.app_key_name}</span>
                      <Badge variant={item.connected ? "default" : "secondary"}>
                        {item.connected
                          ? item.connection?.user_type ?? "Connected"
                          : "Not connected"}
                      </Badge>
                    </div>
                    {item.connected && item.connection && (
                      <p className="mt-0.5 truncate text-muted-foreground text-xs">
                        {item.connection.subaccount_name}
                      </p>
                    )}
                    <div className="mt-2 flex gap-4 text-muted-foreground text-xs">
                      <span>
                        <span className="font-medium text-foreground">
                          {item.total_calls.toLocaleString()}
                        </span>{" "}
                        calls
                      </span>
                      <span>
                        <span className="font-medium text-foreground">
                          {item.errors}
                        </span>{" "}
                        errors
                      </span>
                      <span>
                        <span className="font-medium text-foreground">
                          {item.error_rate.toFixed(1)}%
                        </span>{" "}
                        error rate
                      </span>
                      {item.avg_response_time_ms != null && (
                        <span>
                          <span className="font-medium text-foreground">
                            {(item.avg_response_time_ms as number).toFixed(0)}ms
                          </span>{" "}
                          avg
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
