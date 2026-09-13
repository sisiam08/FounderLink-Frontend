"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Archive, ChevronLeft, ChevronRight } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { SkeletonRows } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { ICofounderRequirement } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  closeRequirement,
  getAdminRequirements,
} from "@/services/admin.service";
import { formatDate } from "@/helpers/date-utils";

export default function RequirementsClient({
  initialRequirements,
  initialTotal,
  initialLimit,
  initialError,
}: {
  initialRequirements: ICofounderRequirement[];
  initialTotal: number;
  initialLimit: number;
  initialError?: string;
}) {
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [total, setTotal] = useState(initialTotal);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [closeId, setCloseId] = useState<string | null>(null);

  const initializedRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchRequirements = useCallback(
  async (targetPage = page) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const res = await getAdminRequirements({
        status,
        role,
        page: targetPage,
      });

      if (requestId !== requestIdRef.current) return;

      setRequirements(res.requirements);
      setTotal(res.total);
      setLimit(res.limit);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      const message = getApiErrorMessage(error);

      setError(message);

      toast.add({
        type: "error",
        description: message,
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  },
  [status, role, page]
);


    useEffect(() => {
  if (!initializedRef.current) {
    initializedRef.current = true;
    return;
  }

  void fetchRequirements();

  return () => {
    requestIdRef.current += 1;
  };
    }, [fetchRequirements]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Content Moderation — Requirements
      </h1>
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as string);
              setPage(1);
              setLoading(true);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v as string);
              setPage(1);
              setLoading(true);
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}