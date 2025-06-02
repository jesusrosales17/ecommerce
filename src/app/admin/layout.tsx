
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminLayout from "@/features/admin/components/AdminLayout";
import { AuthProvider } from "@/app/providers";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminLayout>{children}</AdminLayout>
      </SidebarProvider>
    </AuthProvider>
  );
}
