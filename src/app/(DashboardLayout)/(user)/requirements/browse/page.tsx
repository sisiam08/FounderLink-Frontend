import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import BrowseClient from "../../_component/requirements/browse-client";
import type { IProfile, IRequirementWithScore } from "@/interfaces";
import { getMyProfile } from "@/services/profile.service";
import {
    getBrowseRequirements,
    type BrowseRequirementsResult,
} from "@/services/requirement.service";

export const dynamic="force-dynamic";

export default async function BrowsePage({
    searchParams,
}:{
    searchParams:Promise<{
        role?:string|string[];
        industry?:string | string[];
        stage?: string | string[];
    }>;
}){
    
}

