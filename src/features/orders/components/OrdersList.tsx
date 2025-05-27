'use client'

import { OrderTable } from "./OrderTable";
import { OrderInfoDrawer } from "./OrderInfoDrawer";
import { Order } from "../store/useOrderStore";

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div>
      <OrderTable orders={orders} />
      <OrderInfoDrawer />
    </div>
  );
}
