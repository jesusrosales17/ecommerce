'use client';

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";
import { getBadgeVariant, getStatusText } from "../../utils/orders";

interface OrderStatusDisplayProps {
  status: OrderStatus;
}



export const OrderStatusDisplay = ({ status }: OrderStatusDisplayProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Estado del Pedido</h3>
      <Badge variant={getBadgeVariant(status) || "default"} className="mt-1 uppercase">
        {getStatusText(status)}
      </Badge>
    </div>
  );
};
