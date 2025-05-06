import { BarChart, Home, Package, Settings, ShoppingCart, Tag, Users } from "lucide-react";

export const ADMIN_MENU_ITEMS = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Productos", url: "/admin/products", icon: Package },
  { title: "Categorías", url: "/admin/categories", icon: Tag },
  { title: "Pedidos", url: "/admin/orders", icon: ShoppingCart },
  { title: "Clientes", url: "/admin/customers", icon: Users },
];

export const ADMIN_OTHER_ITEMS = [
  { title: "Estadísticas", url: "/admin/statistics", icon: BarChart },
  { title: "Configuración", url: "/admin/settings", icon: Settings },
];