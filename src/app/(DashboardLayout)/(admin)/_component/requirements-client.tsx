"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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


function RequirementsClient({
    initialRequirements,
    initialTotal,
    initialLimit,
}:{
    initialRequirements:ICofounderRequirement[];
    initialTotal:number;
    initialLimit:number;
}){
    const[status, setStatus]=useState("all");
    const[role, setRole]=useState("all");
    const[page, setPage]=useState(1);
    const[requirements, setRequirements]=useState(initialRequirements);
    const[total, setTotal]=useState(initialTotal);
    const[limit, setLimit]=useState(initialLimit);
    const[loading, setLoading]=useState(false);
    const[closeId, setCloseId]=useState<string | null>(null);
    const initializedRef=useRef(false);

    return <div className="sapce-y-6"></div>
}

export {RequirementsClient};