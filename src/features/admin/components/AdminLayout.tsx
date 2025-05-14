import { ReactNode } from "react";
import { SidebarAdmin } from "./SidebarAdmin";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "./Header";
import { getSessionServer } from "@/features/auth/utils/auth-server";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = async ({ children }: AdminLayoutProps) => {
    const session = await getSessionServer();
  return (
      <div className="flex h-screen overflow-hidden w-full">
        {/* Sidebar */}
        <SidebarAdmin session={session!} />
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200">
            <SidebarTrigger />
            {/* Header */}
            <Header />
          </div>

          {/* Content */}
          <main className="p-6">{children}</main>
        </div>

  
      </div>
  );
};

export default AdminLayout;
