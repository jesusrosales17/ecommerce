"use client";

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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  Users,
  ShoppingCart,
  Tag,
  Settings,
  Grid,
  BarChart,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { SidebarFooterUser } from "@/components/template/SidebarFooter";
import { Session } from "next-auth";

export const menuItems = [
  { title: "Inicio", url: "/admin", icon: Home },
  { title: "Productos", url: "/admin/products", icon: Grid },
  { title: "Categorías", url: "/admin/categories", icon: Tag },
  { title: "Pedidos", url: "/admin/orders", icon: ShoppingCart },
  { title: "Clientes", url: "/admin/customers", icon: Users },
  { title: "Reportes y analisis", url: "/admin/reports", icon: BarChart },
  { title: "Notificaciones", url: "/admin/notifications", icon: Bell },
  { title: "Configuración", url: "/admin/settings", icon: Settings },
];

interface Props {
  // session de next-auth
  session: Session;
}

export const SidebarAdmin = ({ session }: Props) => {  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const isMobile = useIsMobile(); // Detecta si es un dispositivo móvil
  // Función para cerrar el sidebar en dispositivos móviles
  const handleMenuItemClick = () => {
    if (isMobile) {
      // En dispositivos móviles, cerramos completamente el sidebar
      setOpenMobile(false);
    }
  };

  return (
    <SessionProvider  session={session} >
      <Sidebar className=" h-dvh">
        <SidebarHeader className="p-">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white font-bold">
              A
            </div>
            <h2 className="text-xl font-semibold">Admin Panel</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel>Gestión</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.slice(0, 5).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="relative">                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      onMouseEnter={() =>
                        isCollapsed && setActiveTooltip(item.title)
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Link href={item.url} onClick={handleMenuItemClick}>
                        <item.icon className="h-5 w-5 " />
                        <span className={isCollapsed ? "sr-only" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Custom tooltip */}
                    {isCollapsed && activeTooltip === item.title && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-yellow-50 text-yellow-900 text-sm rounded-md border border-yellow-200 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>          <SidebarGroup className="px-3 py-2 mt-4">
            <SidebarGroupLabel>Análisis</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.slice(5, 7).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="relative">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      onMouseEnter={() =>
                        isCollapsed && setActiveTooltip(item.title)
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Link href={item.url} onClick={handleMenuItemClick}>
                        <item.icon />
                        <span className={isCollapsed ? "sr-only" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Custom tooltip */}
                    {isCollapsed && activeTooltip === item.title && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-blue-50 text-blue-900 text-sm rounded-md border border-blue-200 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>          <SidebarGroup className="px-3 py-2 mt-4">
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.slice(7).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="relative">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      onMouseEnter={() =>
                        isCollapsed && setActiveTooltip(item.title)
                      }
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Link href={item.url} onClick={handleMenuItemClick}>
                        <item.icon />
                        <span className={isCollapsed ? "sr-only" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Custom tooltip */}
                    {isCollapsed && activeTooltip === item.title && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1 bg-gray-50 text-gray-900 text-sm rounded-md border border-gray-200 whitespace-nowrap">
                        {item.title}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooterUser />
        
      </Sidebar>
    </SessionProvider>
  );
};
