"use client";

import { type ReactNode } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export function ChartMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-62.5 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{label ?? item.name}</p>
      <p className="mt-1 text-muted-foreground">
        Value:{" "}
        <span className="font-semibold text-foreground">
          {item.value ?? "—"}
        </span>
      </p>
    </div>
  );
}

export function KpiRing({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: number | string;
  percent: number;
  color: string;
}) {
  const data = [
    { name: label, value: Math.max(0, Math.min(percent, 100)), fill: color },
  ];

  return (
    <Card className="overflow-hidden border-border/70 bg-card/80">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative size-19 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              barSize={8}
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: "var(--chart-grid)" }}
                dataKey="value"
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {value}
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {label === "Open startups"
              ? `${percent}% available`
              : `${percent}% of tracked total`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}