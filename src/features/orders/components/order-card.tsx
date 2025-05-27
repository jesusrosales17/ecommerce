import { Order, OrderItem, OrderStatus } from "@prisma/client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateOrderStatus } from "../services/order-service";
import { formatPrice } from "@/utils/price";
import { formatDate } from "@/utils/date";
import { 
  BadgeCheck,
  Box,
  Clock,
  ShoppingBag,
  Truck,
  XCircle
} from "lucide-react";

interface OrderCardProps {
  order: Order & {
    User: {
      name: string | null;
      email: string | null;
    };
    Address: any;
    items: (OrderItem & {
      Product: {
        name: string;
        images: { name: string }[];
      }
    })[];
  };
  onStatusUpdate: () => void;
}

export const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const { toast } = useToast();
  
  // Function to handle status change
  const handleStatusChange = async (status: string) => {
    try {
      await updateOrderStatus(order.id, status);
      toast({
        title: "Estado actualizado",
        description: `El pedido ha sido actualizado a ${getStatusLabel(status as OrderStatus)}`,
      });
      onStatusUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
      });
    }
  };
  
  // Function to get status label and icon
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 mr-2" />;
      case "PROCESSING":
        return <ShoppingBag className="h-4 w-4 mr-2" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4 mr-2" />;
      case "DELIVERED":
        return <BadgeCheck className="h-4 w-4 mr-2" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 mr-2" />;
      default:
        return <Box className="h-4 w-4 mr-2" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-lg">{formatPrice(order.total)}</span>
          <div className={`text-sm px-2 py-1 rounded-full flex items-center ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {getStatusLabel(order.status)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-1">Cliente</h4>
        <p>{order.User.name || "Usuario"}</p>
        <p className="text-sm text-gray-600">{order.User.email}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-1">Dirección de envío</h4>
        <p>{order.Address.name}</p>
        <p>{order.Address.street}</p>
        <p>{order.Address.city}, {order.Address.state}, {order.Address.postalCode}</p>
        <p>{order.Address.phone}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-1">Productos ({order.items.length})</h4>
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <div>
                <span className="font-medium">{item.name}</span>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <span className="font-medium">{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Cambiar estado</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Estado del pedido</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={order.status} onValueChange={handleStatusChange}>
              <DropdownMenuRadioItem value="PENDING" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Pendiente
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="PROCESSING" className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Procesando
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="SHIPPED" className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Enviado
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DELIVERED" className="flex items-center">
                <BadgeCheck className="h-4 w-4 mr-2" />
                Entregado
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="CANCELLED" className="flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelado
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
