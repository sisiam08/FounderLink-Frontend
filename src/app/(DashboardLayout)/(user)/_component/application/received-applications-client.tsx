"use client";

import { useState } from "react";

import { Check, MessageSquare, UsersRound, X } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { IApplication } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  acceptApplication,
  getReceivedApplications,
  rejectApplication,
} from "@/services/application.service";
import { formatDate } from "@/helpers/date-utils";
import { initials } from "@/helpers/string-utils";

type Action = { type: "accept" | "reject"; appId: string };

export default function ReceivedApplicationsClient({
  initialApplications,
}: {
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] =
    useState<IApplication[]>(initialApplications);
  const [action, setAction] = useState<Action | null>(null);

  async function reload() {
    try {
      setApplications(await getReceivedApplications());
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  async function handleAction(current: Action) {
    try {
      if (current.type === "accept") {
        await acceptApplication(current.appId);
      } else {
        await rejectApplication(current.appId);
      }
      toast.add({
        type: "success",
        description: `Application ${current.type === "accept" ? "accepted" : "rejected"}`,
      });
      await reload();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<UsersRound className="size-12" />}
        title="No applications yet"
        description="When someone applies to one of your startup requirements, they'll appear here."
        actionLabel="View my startups"
        actionHref="/startups/mine"
      />
    );
  }

  return (
    <>
      

      
    </>
  );
}
