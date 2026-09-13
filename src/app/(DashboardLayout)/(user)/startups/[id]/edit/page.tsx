import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { IStartupIdea } from "@/interfaces";
import { getStartupById } from "@/services/startup.service";

export default async function EditStartupPage({
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
    <div className="max-w-2xl space-y-6">
      <Link
        href={`/startups/${id}`}
        className="-ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      
    </div>
  );
}
