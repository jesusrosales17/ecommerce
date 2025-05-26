'use client'

import { OrderTable } from "@/features/orders/components/OrderTable";
import { OrderInfoDrawer } from "@/features/orders/components/OrderInfoDrawer";
import { useState } from "react";
import { Order } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrdersClientProps {
  orders: Order[];
  counts: {
    ALL: number;
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
  };
}

export function OrdersClient({ orders, counts }: OrdersClientProps) {
  const [status, setStatus] = useState<"ALL" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED">("ALL");

  const filteredOrders = status === "ALL" 
    ? orders 
    : orders.filter(order => order.status === status);

  return (
    <>
      <Tabs defaultValue="ALL" onValueChange={(value) => setStatus(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="ALL">
            Todos ({counts.ALL})
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            Pendientes ({counts.PENDING})
          </TabsTrigger>
          <TabsTrigger value="PROCESSING">
            Procesando ({counts.PROCESSING})
          </TabsTrigger>
          <TabsTrigger value="SHIPPED">
            Enviados ({counts.SHIPPED})
          </TabsTrigger>
          <TabsTrigger value="DELIVERED">
            Entregados ({counts.DELIVERED})
          </TabsTrigger>
          <TabsTrigger value="CANCELLED">
            Cancelados ({counts.CANCELLED})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={status} className="mt-0">
          <OrderTable orders={filteredOrders} />
        </TabsContent>
      </Tabs>
      
      <OrderInfoDrawer />
    </>
  );
}
