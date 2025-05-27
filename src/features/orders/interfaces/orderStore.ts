import { OrderStatus } from "@prisma/client";
import { OrderWithRelations } from "./order";

// Usamos este tipo para nuestra aplicación
export type Order = OrderWithRelations;


export interface OrderStore {
  // Estado
  orders: Order[];
  isOpenInfoDrawer: boolean;
  orderToShow: Order | null;
  
  // Métodos para manipular estado
  setIsOpenInfoDrawer: (isOpen: boolean) => void;
  setOrderToShow: (order: Order | null) => void;
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}