"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOverview } from "@/interfaces";

interface PlatformHealthCardProps {
  overview: AdminOverview | null;
  totalApplications: number;
  percentOf: (value: number, total: number) => number;
}

export function PlatformHealthCard({
  overview,
  totalApplications,
  percentOf,
}: PlatformHealthCardProps) {
  const metrics = [
    {
      label: "User activity",
      value: overview?.usersByStatus?.active ?? 0,
      total: overview?.users ?? 0,
      detail: `${overview?.usersByStatus?.suspended ?? 0} suspended - ${overview?.usersByStatus?.banned ?? 0} banned`,
      color: "var(--chart-cyan)",
    },
    {
      label: "Startup availability",
      value: overview?.startupsByStatus?.open ?? 0,
      total: overview?.startups ?? 0,
      detail: `${overview?.startupsByStatus?.closed ?? 0} closed`,
      color: "var(--chart-violet)",
    },
    {
      label: "Application success",
      value: overview?.applicationSummary?.accepted ?? 0,
      total: overview?.applicationSummary?.total ?? totalApplications,
      detail: `${overview?.applicationSummary?.acceptanceRate ?? 0}% accepted`,
      color: "var(--chart-amber)",
    },
  ];

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader>
        <CardTitle className="text-base">Platform health</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          A quick view of account activity, startup availability, and application outcomes
        </p>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => {
          const percentage = percentOf(metric.value, metric.total);
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm font-medium">{metric.label}</p>
                <p className="text-lg font-semibold">{percentage}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: metric.color,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {metric.value} of {metric.total} · {metric.detail}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}