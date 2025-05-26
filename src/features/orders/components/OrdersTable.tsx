'use client'
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { OrderStatus } from "@prisma/client";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { UpdateOrderStatusDialog } from "./UpdateOrderStatusDialog";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { formatDate } from "@/utils/date";
import { formatPrice } from "@/utils/price";

interface Order {
  id: string;
  userId: string;
  addressId: string;
  total: number;
  status: OrderStatus;
  paymentId: string | null;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string;
  User: {
    name: string | null;
    email: string | null;
  };
  items: any[];
  Address: any;
}

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const { setIsOpenInfoDrawer, setOrderToShow } = useOrderStore();

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los pedidos");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === filter);

  // View order details
  const handleViewOrder = (order: Order) => {
    setOrderToShow(order);
    setIsOpenInfoDrawer(true);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          variant={filter === "ALL" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("ALL")}
        >
          Todos ({orders.length})
        </Button>
        
        {Object.values(OrderStatus).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="flex items-center gap-1"
          >
            <OrderStatusBadge status={status} className="px-0" />
            ({orders.filter(order => order.status === status).length})
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Cargando pedidos...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No hay pedidos {filter !== "ALL" && "con este estado"}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {order.User.name || "Usuario"}
                    <div className="text-xs text-gray-500">
                      {order.User.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <UpdateOrderStatusDialog
                        orderId={order.id}
                        currentStatus={order.status}
                        onStatusUpdated={fetchOrders}
                        trigger={
                          <Button variant="outline" size="sm">
                            Cambiar estado
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};