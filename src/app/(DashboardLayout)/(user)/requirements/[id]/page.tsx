import { ArrowLeft, Clock, Percent, Tag } from "lucide-react";

import Link from "next/link";

import { notFound } from "next/navigation";

import ApplyToRequirement from "../../_component/requirements/apply-to-requirement";
import CompatibilityScoreBadge from "../../../../../components/shared/compatibility-score-badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import type { IRequirementWithScore } from "@/interfaces";
import { getRequirementDetails } from "@/services/requirement.service";

export default async function RequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let requirementData: IRequirementWithScore | null = null;

  return (
    <div className="max-w-3xl space-y-6">
  
    </div>
  );
}