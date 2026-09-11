"use client";

import { useState } from "react";

import type { IApplication } from "@/interfaces";
import { getMyApplications, withdrawApplication } from "@/services/application.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "@/components/ui/toast";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageSquare } from "lucide-react";

export default function MyApplicationsClient({
  initialApplications,
}: {
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] =
    useState<IApplication[]>(initialApplications);
  const [withdrawId, setWithdrawId] = useState<string | null>(null);

  async function reload() {
    try {
      setApplications(await getMyApplications());
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleWithdraw(id: string) {
    try {
      await withdrawApplication(id);
      toast.add({ type: "success", description: "Application withdrawn" });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="size-12" />}
        title="No applications yet"
        description="Browse open requirements and apply to become a co-founder."
        actionLabel="Browse requirements"
        actionHref="/requirements/browse"
      />
    );
  }

  return (
    <>
      
    </>
  );
}
