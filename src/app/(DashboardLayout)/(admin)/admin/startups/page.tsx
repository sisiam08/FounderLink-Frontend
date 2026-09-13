import type { AdminStartupsPage } from "@/interfaces";

import { getAdminStartups } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminStartupsPage() {
  let data: AdminStartupsPage = { startups: [], total: 0, page: 1, limit: 20 };
  let initialError: string | undefined;
  try {
    data = await getAdminStartups({ page: 1 });
  } catch {
    initialError = "Unable to load startups.";
  }

  return (
    
  );
}
