import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ApplicantsClient from "../../../_component/application/applicants-client";

import type { IApplication } from "@/interfaces";
import { getRequirementApplications } from "@/services/requirement.service";

export default async function ApplicantsPage({
    params,
}:{
    params:Promise<{id:string}>
}){
    return;
}