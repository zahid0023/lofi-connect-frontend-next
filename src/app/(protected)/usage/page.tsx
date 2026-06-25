"use client";

import {
  Activity,
  AlertCircle,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
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
import { mockConnections, mockUsageData } from "@/services/mockData";

export default function UsagePage() {
  const [timeRange, setTimeRange] = useState("7d");

  const userConnections = mockConnections.filter((c) => c.userId === "1");

  const getFilteredData = () => {
    switch (timeRange) {
      case "24h":
        return mockUsageData.slice(-1);
      case "7d":
        return mockUsageData.slice(-7);
      case "30d":
        return mockUsageData;
      default:
        return mockUsageData.slice(-7);
    }
  };

  const filteredData = getFilteredData();
  const totalCalls = filteredData.reduce((sum, d) => sum + d.calls, 0);
  const totalErrors = filteredData.reduce((sum, d) => sum + d.errors, 0);
  const successRate = ((1 - totalErrors / totalCalls) * 100).toFixed(1);
  const avgCalls = Math.round(totalCalls / filteredData.length);

  const previousPeriodData = mockUsageData.slice(-14, -7);
  const previousTotalCalls = previousPeriodData.reduce(
    (sum, d) => sum + d.calls,
    0,
  );
  const callsChange = (
    ((totalCalls - previousTotalCalls) / previousTotalCalls) *
    100
  ).toFixed(1);
  const isPositiveChange = parseFloat(callsChange) >= 0;

  // Usage by connection
  const usageByConnection = userConnections
    .filter((c) => c.status === "active" && c.apiKey)
    .map((conn) => ({
      name: conn.name,
      calls: Math.floor(Math.random() * totalCalls * 0.6) + 100,
    }))
    .sort((a, b) => b.calls - a.calls);

  const stats = [
    {
      title: "Total API Calls",
      value: totalCalls.toLocaleString(),
      change: `${isPositiveChange ? "+" : ""}${callsChange}%`,
      trend: isPositiveChange ? "up" : "down",
      icon: Activity,
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      change: "+0.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Errors",
      value: totalErrors.toLocaleString(),
      change: "-12%",
      trend: "down",
      icon: AlertCircle,
    },
    {
      title: "Avg Calls/Day",
      value: avgCalls.toLocaleString(),
      icon: TrendingUp,
    },
  ];
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="font-bold text-2xl">{stat.value}</div>
                {stat.change && (
                  <Badge
                    variant="secondary"
                    className={
                      stat.trend === "up"
                        ? "text-success"
                        : stat.trend === "down" && stat.title === "Errors"
                          ? "text-success"
                          : "text-destructive"
                    }
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {stat.change}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Calls Over Time</CardTitle>
            <CardDescription>Daily API calls and errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    className="text-xs"
                  />
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
                    dataKey="calls"
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Connection</CardTitle>
            <CardDescription>API calls breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>Most frequently called</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { endpoint: "/api/contacts", calls: 2847, percentage: 35 },
                { endpoint: "/api/opportunities", calls: 1923, percentage: 24 },
                { endpoint: "/api/campaigns", calls: 1456, percentage: 18 },
                { endpoint: "/api/conversations", calls: 1102, percentage: 14 },
              ].map((item) => (
                <div key={item.endpoint} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <code className="text-xs">{item.endpoint}</code>
                    <span className="text-muted-foreground">
                      {item.calls.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
