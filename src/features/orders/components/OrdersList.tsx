'use client'

import { OrderTable } from "./OrderTable";
import { OrderInfoDrawer } from "./OrderInfoDrawer";
import { OrderWithRelations } from "../interfaces/order";

interface OrdersListProps {
  orders: OrderWithRelations[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div>
      <OrderTable orders={orders} />
      <OrderInfoDrawer />
    </div>
  );
}
