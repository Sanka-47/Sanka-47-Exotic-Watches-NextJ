import { requireAdminPage } from "@/lib/auth-guards";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();

  return <AdminShell userName={user.name ?? user.email ?? "Admin"}>{children}</AdminShell>;
}
