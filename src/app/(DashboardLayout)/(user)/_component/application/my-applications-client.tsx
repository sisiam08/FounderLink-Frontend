"use client";

import { useState } from "react";

import type { IApplication } from "@/interfaces";
import { getMyApplications } from "@/services/application.service";
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

  return (
    <>
      
    </>
  );
}
