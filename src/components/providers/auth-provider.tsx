"use client";

import { restoreSession } from "@/lib/auth-refresh";
import { useEffect } from "react";
import Loader from "../shared/loader";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    const restore = async () => {
      const success = await restoreSession();

      if (!success) {
        router.replace("/login");
      }
    };
    restore();
  }, []);

  if (!initialized) {
    return <Loader fullScreen />;
  }

  return <>{children}</>;
}
