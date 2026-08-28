import { AuthProvider } from "@/components/providers/auth-provider";
import { SystemRole } from "@/constants/user-role";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardLayout({
  admin,
  user,
}: Readonly<{
  admin: React.ReactNode;
  user: React.ReactNode;
}>) {
  const userRole = useAuthStore.getState().user?.systemRole as SystemRole;
  return (
    <>
      <AuthProvider>
        {userRole === SystemRole.ADMIN ? admin : user}
      </AuthProvider>
    </>
  );
}
