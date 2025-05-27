'use client'

import { OrdersClient } from "./OrdersClient";
import { OrderInfoDrawer } from "./OrderInfoDrawer";
import { OrderWithRelations } from "../interfaces/order";

interface OrdersListProps {
  orders: OrderWithRelations[];
}

export function OrdersList({ orders }: OrdersListProps) {
  // Contar pedidos por cada estado
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(order => order.status === "PENDING").length,
    PROCESSING: orders.filter(order => order.status === "PROCESSING").length,
    SHIPPED: orders.filter(order => order.status === "SHIPPED").length,
    DELIVERED: orders.filter(order => order.status === "DELIVERED").length,
    CANCELLED: orders.filter(order => order.status === "CANCELLED").length,
  };

  return (
    <div>
      <OrdersClient orders={orders} counts={counts} />
      <OrderInfoDrawer />
    </div>
  );
}
