'use client';

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";

interface OrderStatusDisplayProps {
  status: OrderStatus;
}

// Función para traducir el estado
const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'PROCESSING':
      return 'Procesando';
    case 'SHIPPED':
      return 'Enviado';
    case 'DELIVERED':
      return 'Entregado';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
};

// Función para obtener el color del badge según el estado
const getBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'PENDING':
      return 'default';
    case 'PROCESSING':
      return 'secondary';
    case 'SHIPPED':
      return 'secondary';
    case 'DELIVERED':
      return 'secondary'; 
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
};

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
