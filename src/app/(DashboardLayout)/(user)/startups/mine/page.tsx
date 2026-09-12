import { ArrowRight, Plus, Rocket } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IStartupIdea } from "@/interfaces";
import { getMyStartups } from "@/services/startup.service";

export const dynamic = "force-dynamic";

export default async function MyStartupsPage() {
  let startups: IStartupIdea[] = [];
  try {
    startups = await getMyStartups();
  } catch {
    startups = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Startup Ideas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your startup ideas and their co-founder requirements
        </p>
      </div>

      {startups.length === 0 ? (
        <EmptyState
          icon={<Rocket className="size-12" />}
          title="No startup ideas yet"
          description="Create your first startup idea to start finding co-founders."
          actionLabel="Create startup idea"
          actionHref="/startups/new"
        />
      ) : (
       
      )}
    </div>
  );
}
