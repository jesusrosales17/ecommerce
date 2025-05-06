import { SidebarProvider } from "@/components/ui/sidebar";
import AdminLayout from "@/features/admin/components/AdminLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminLayout>{children}</AdminLayout>;
    </SidebarProvider>
  );
}
