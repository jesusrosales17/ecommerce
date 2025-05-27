import { OrderStatus } from "@prisma/client";
import { OrderWithRelations } from "./order";

// Usamos este tipo para nuestra aplicación
export type Order = OrderWithRelations;


export interface OrderStore {
  isOpenInfoDrawer: boolean;
  orderToShow: Order | null;
  setIsOpenInfoDrawer: (isOpen: boolean) => void;
  setOrderToShow: (order: Order | null) => void;
  changeOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}