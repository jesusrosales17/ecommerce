import { OrderCard } from "@/features/orders/components/order-card";
import { getOrders } from "@/features/orders/services/order-service";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order, OrderItem, OrderStatus } from "@prisma/client";

interface OrderWithDetails extends Order {
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
}

export const OrdersAdminList = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);
  
  const getOrderCountByStatus = (status: OrderStatus | "all") => {
    if (status === "all") return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
      
      <Tabs defaultValue="all" onValueChange={setSelectedStatus}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            Todos ({getOrderCountByStatus("all")})
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            Pendientes ({getOrderCountByStatus("PENDING")})
          </TabsTrigger>
          <TabsTrigger value="PROCESSING">
            Procesando ({getOrderCountByStatus("PROCESSING")})
          </TabsTrigger>
          <TabsTrigger value="SHIPPED">
            Enviados ({getOrderCountByStatus("SHIPPED")})
          </TabsTrigger>
          <TabsTrigger value="DELIVERED">
            Entregados ({getOrderCountByStatus("DELIVERED")})
          </TabsTrigger>
          <TabsTrigger value="CANCELLED">
            Cancelados ({getOrderCountByStatus("CANCELLED")})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedStatus} className="space-y-4">
          {loading ? (
            <div className="text-center p-8">Cargando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-gray-500">No hay pedidos {selectedStatus !== "all" && "con este estado"}</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusUpdate={fetchOrders} 
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
