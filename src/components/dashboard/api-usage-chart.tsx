"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { UsageData } from "@/types";

const chartConfig = {
  calls: {
    label: "Calls",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ApiUsageChart({
  chartData,
}: Readonly<{ chartData: UsageData[] }>) {
  return (
    <ChartContainer config={chartConfig} className="size-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid
          // vertical={false
          strokeDasharray="3 3"
          className="stroke-muted"
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              weekday: "short",
            })
          }
        />
        <YAxis className="text-xs" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              className="border border-border"
            />
          }
        />
        <Line
          dataKey="calls"
          type="natural"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
