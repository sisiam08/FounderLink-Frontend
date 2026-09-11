"use client";

import { useState } from "react";

import type { IApplication } from "@/interfaces";
import { getMyApplications, withdrawApplication } from "@/services/application.service";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "@/components/ui/toast";

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

  return (
    <>
      
    </>
  );
}
