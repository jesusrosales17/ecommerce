import { ReactNode } from "react";
import { SidebarAdmin } from "./SidebarAdmin";
import { Toaster } from "@/components/ui/sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar */}
      <SidebarAdmin />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200">
          <SidebarTrigger />
          {/* Header */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-xl font-semibold">Panel de Administración</h1>
              <div className="flex items-center space-x-4">
                {/* Notifications, profile dropdown, etc. could go here */}
              </div>
            </div>
          </header>
        </div>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Toaster for notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminLayout;
