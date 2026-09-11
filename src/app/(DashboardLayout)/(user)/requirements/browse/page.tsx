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
   const sp=await searchParams;

   const role = (sp.role ?? "all").toString();
   const industry=(sp.industry ?? "all").toString();
   const stage=(sp.stage ?? "all").toString();

   let profile: IProfile | null=null;
   let requirements: IRequirementWithScore[]=[];
   let nextCursor: BrowseRequirementsResult["nextCursor"]=null;


   try{
    const[profileRes, listRes]=await Promise.all([
        getMyProfile(),
        getBrowseRequirements({role,industry,stage}),
    ]);
   }

   catch{}
}

