import { OrderStatus } from "@prisma/client";

export const getBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "secondary";
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

 // Función para traducir el estado
export  const getStatusText = (status: OrderStatus) => {
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