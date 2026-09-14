"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import CompatibilityScoreBadge from "@/components/shared/compatibility-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkeletonRows } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { IApplication } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAdminApplications } from "@/services/admin.service";
import { formatDate } from "@/helpers/date-utils";
import { initials } from "@/helpers/string-utils";

export default function ApplicationsClient({
  initialApplications,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialApplications: IApplication[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [requirementId, setRequirementId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState(initialApplications);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchApplications = useCallback(
    async (targetPage = page) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminApplications({
          status,
          requirementId,
          candidateId,
          page: targetPage,
        });
        if (requestId !== requestIdRef.current) return;
        setApplications(res.applications);
        setTotal(res.total);
        setLimit(res.limit);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        const message = getApiErrorMessage(error);
        setError(message);
        toast.add({ type: "error", description: message });
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [status, requirementId, candidateId, page]
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    void fetchApplications();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchApplications]);

  const totalPages = Math.ceil(total / limit);

  return (
    
  );
}
