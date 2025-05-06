'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/libs/utils";
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Tag, 
  Settings, 
  Grid, 
  BarChart, 
  Bell,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const iconMap = {
  Home,
  Users,
  ShoppingCart,
  Tag,
  Settings,
  Grid,
  BarChart,
  Bell,
  User,
};

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

interface ClientSidebarAdminProps {
  userName: string;
  userEmail: string;
  userImage: string | null;
  initials: string;
  menuItems: MenuItem[];
}

export const ClientSidebarAdmin = ({ 
  userName, 
  userEmail, 
  userImage, 
  initials,
  menuItems
}: ClientSidebarAdminProps) => {
  const pathname = usePathname();
  const {state} = useSidebar();
  const isCollapsed = state === "collapsed";
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { logout, isLoading } = useAuth();
  
  const handleSignOut = () => {
    logout();
  };
  
  return (
    <Sidebar className="h-dvh">
      <SidebarHeader className="p-">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold">A</div>
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => {
              // @ts-ignore - Accedemos al icono dinámicamente
              const Icon = iconMap[item.icon] || Home;
              const isActive = pathname === item.url;
              
              return (
                <SidebarMenuItem key={item.url} className={cn("relative", isActive && "bg-gray-100")}>
                  <Link href={item.url} className="flex items-center py-2 px-3">
                    <SidebarMenuButton
                      onMouseEnter={() => !isCollapsed && setActiveTooltip(null)}
                      className={cn(
                        "w-10 h-10 p-0 mr-4 flex items-center justify-center rounded-md",
                        isActive && "text-blue-600 bg-blue-50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </SidebarMenuButton>
                    <span className={cn("text-gray-700", isActive && "font-medium")}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 bg-gray-300">
              {userImage && <AvatarImage src={userImage} alt={userName} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors py-1 px-2 rounded-md hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            <span className={isCollapsed ? "sr-only" : ""}>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </Sidebar>
  );
};