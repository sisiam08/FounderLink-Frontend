"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkeletonStatGrid } from "@/components/shared/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  AdminApplicationStats,
  AdminOverview,
  AdminRequirementStats,
  AdminSignupRow,
} from "@/interfaces";
import {
  getAdminApplicationStats,
  getAdminOverview,
  getAdminRequirementStats,
  getAdminUserSignups,
} from "@/services/admin.service";
import { formatSignupDate } from "@/helpers/date-utils";
import { PlatformHealthCard } from "./platform-health-card";
import { ChartMessage, ChartTooltip, KpiRing } from "./dashboard-charts";

export default function DashboardClient() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [appStats, setAppStats] = useState<AdminApplicationStats | undefined>();
  const [reqStats, setReqStats] = useState<AdminRequirementStats | undefined>();
  const [signups, setSignups] = useState<AdminSignupRow[] | undefined>();
  
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [appStatsLoading, setAppStatsLoading] = useState(true);
  const [appStatsError, setAppStatsError] = useState<string | null>(null);
  const [reqStatsLoading, setReqStatsLoading] = useState(true);
  const [reqStatsError, setReqStatsError] = useState<string | null>(null);
  const [signupsLoading, setSignupsLoading] = useState(true);
  const [signupsError, setSignupsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getAdminOverview()
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setOverviewError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setOverviewLoading(false);
      });

    void getAdminApplicationStats()
      .then((data) => {
        if (active) setAppStats(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setAppStatsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setAppStatsLoading(false);
      });

    void getAdminRequirementStats()
      .then((data) => {
        if (active) setReqStats(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setReqStatsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setReqStatsLoading(false);
      });

    void getAdminUserSignups()
      .then((data) => {
        if (active) setSignups(data);
      })
      .catch((error) => {
        if (!active) return;
        const message = getApiErrorMessage(error);
        setSignupsError(message);
        toast.add({ type: "error", description: message });
      })
      .finally(() => {
        if (active) setSignupsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (overviewLoading && !overview) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SkeletonStatGrid />
      </div>
    );
  }

  const appChartData = Object.entries(appStats?.byStatus ?? {}).map(
    ([status, count]) => ({ name: status, count })
  );
  const reqChartData = [
    { name: "Open", count: reqStats?.open ?? 0 },
    { name: "Closed", count: reqStats?.closed ?? 0 },
  ];
  const signupChartData = (signups ?? []).map((row) => ({
    date: formatSignupDate(row.date),
    signups: parseInt(row.count, 10),
  }));
  const totalApplications = Object.values(overview?.applications ?? {}).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalRequirements = (reqStats?.open ?? 0) + (reqStats?.closed ?? 0);
  const percentOf = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const kpiRings = [
    {
      label: "Active sessions",
      value: overview?.activeSessions ?? "—",
      percent: percentOf(overview?.activeSessions ?? 0, overview?.users ?? 0),
      color: "var(--chart-cyan)",
    },
    {
      label: "Open requirements",
      value: overview?.requirements.open ?? "—",
      percent: percentOf(reqStats?.open ?? 0, totalRequirements),
      color: "var(--chart-violet)",
    },
    {
      label: "Pending applications",
      value: overview?.applications.pending ?? "—",
      percent: percentOf(
        overview?.applications.pending ?? 0,
        totalApplications
      ),
      color: "var(--chart-pink)",
    },
    {
      label: "Open startups",
      value: overview?.startupsByStatus?.open ?? "—",
      percent: percentOf(
        overview?.startupsByStatus?.open ?? 0,
        overview?.startups ?? 0
      ),
      color: "var(--chart-amber)",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {overviewError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            {overviewError}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiRings.map((metric) => (
          <KpiRing key={metric.label} {...metric} />
        ))}
      </div>

      <PlatformHealthCard
        overview={overview}
        totalApplications={totalApplications}
        percentOf={percentOf}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">User signups</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  New accounts created over time
                </p>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                Live trend
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {signupsLoading ? (
              <ChartMessage>Loading signup trend...</ChartMessage>
            ) : signupsError ? (
              <ChartMessage>{signupsError}</ChartMessage>
            ) : signupChartData.length === 0 ? (
              <ChartMessage>No signup data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={signupChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--chart-cyan)"
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-cyan)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--chart-cyan)"
                    strokeWidth={2.5}
                    fill="url(#signupFill)"
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application funnel</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Current application status mix
            </p>
          </CardHeader>
          <CardContent>
            {appStatsLoading ? (
              <ChartMessage>Loading application mix...</ChartMessage>
            ) : appStatsError ? (
              <ChartMessage>{appStatsError}</ChartMessage>
            ) : appChartData.length === 0 ? (
              <ChartMessage>No application data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={appChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {appChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          [
                            "var(--chart-violet)",
                            "var(--chart-cyan)",
                            "var(--chart-amber)",
                            "var(--chart-pink)",
                          ][index % 4]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Requirements: open vs closed
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Moderation workload at a glance
            </p>
          </CardHeader>
          <CardContent>
            {reqStatsLoading ? (
              <ChartMessage>Loading requirement mix...</ChartMessage>
            ) : reqStatsError ? (
              <ChartMessage>{reqStatsError}</ChartMessage>
            ) : totalRequirements === 0 ? (
              <ChartMessage>No requirement data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={reqChartData}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <Tooltip cursor={false} content={<ChartTooltip />} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    <Cell fill="var(--chart-cyan)" />
                    <Cell fill="var(--chart-amber)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requirements by Role</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Demand across the talent categories
            </p>
          </CardHeader>
          <CardContent>
            {reqStatsLoading ? (
              <ChartMessage>Loading role breakdown...</ChartMessage>
            ) : reqStatsError ? (
              <ChartMessage>{reqStatsError}</ChartMessage>
            ) : Object.keys(reqStats?.byRole ?? {}).length === 0 ? (
              <ChartMessage>No role data yet</ChartMessage>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.entries(reqStats?.byRole ?? {}).map(
                    ([role, count]) => ({ name: role, count })
                  )}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="var(--chart-grid)"
                    strokeOpacity={0.5}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    allowDecimals={false}
                    stroke="var(--chart-muted)"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    stroke="var(--chart-muted)"
                    width={72}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-amber)"
                    radius={[0, 5, 5, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}