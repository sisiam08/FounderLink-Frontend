"use client";

import { useState } from "react";

import type { IApplication } from "@/interfaces";

export default function MyApplicationsClient({
  initialApplications,
}: {
  initialApplications: IApplication[];
}) {
  const [applications, setApplications] =
    useState<IApplication[]>(initialApplications);
  const [withdrawId, setWithdrawId] = useState<string | null>(null);

  return (
    <>
      
    </>
  );
}
