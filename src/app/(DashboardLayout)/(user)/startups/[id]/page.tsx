import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import StartupDetailClient from "../../_component/startup/startup-detail-client";
import type { IStartupIdea } from "@/interfaces";
import { getStartupById } from "@/services/startup.service";

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

      

      

      <StartupDetailClient id={startup.id} initialStartup={startup} />
    </div>
  );
}
