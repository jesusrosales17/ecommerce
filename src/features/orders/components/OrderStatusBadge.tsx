import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";
import { BadgeCheck, Clock, PackageCheck, ShoppingBag, Truck, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  // Function to get status label
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PROCESSING":
        return "Procesando";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Function to get badge variant
  const getBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" | null => {
    switch (status) {
      case "PENDING":
        return "outline";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "secondary";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return null;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "PROCESSING":
        return <ShoppingBag className="h-3.5 w-3.5 mr-1" />;
      case "SHIPPED":
        return <Truck className="h-3.5 w-3.5 mr-1" />;
      case "DELIVERED":
        return <BadgeCheck className="h-3.5 w-3.5 mr-1" />;
      case "CANCELLED":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant(status) || "default"} 
      className={`flex items-center ${className}`}
    >
      {getStatusIcon(status)}
      {getStatusLabel(status)}
    </Badge>
  );
};