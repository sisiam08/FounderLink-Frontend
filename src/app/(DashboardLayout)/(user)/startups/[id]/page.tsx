import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import StartupDetailClient from "../../_component/startup/startup-detail-client";
import type { IStartupIdea } from "@/interfaces";
import { getStartupById } from "@/services/startup.service";
import { StatusBadge } from "@/components/shared/status-badge";
import StartupActions from "../../_component/startup/startup-actions";

export default async function StartupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let startup: IStartupIdea | null = null;
  try {
    startup = await getStartupById(id);
  } catch {
    startup = null;
  }

  if (!startup) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/startups/mine"
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to My Startups
      </Link>

        
   <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{startup.title}</h1>
            <StatusBadge status={startup.status} />
          </div>
          <p className="mt-1 text-muted-foreground">
            {startup.shortDescription}
          </p>
        </div>
        <StartupActions id={startup.id} status={startup.status} />
      </div>


      <StartupDetailClient id={startup.id} initialStartup={startup} />
    </div>
  );
}
