'use client'

import { OrderTable } from "./OrderTable";
import { OrderInfoDrawer } from "./OrderInfoDrawer";
import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderWithRelations } from "../interfaces/order";

interface OrdersClientProps {
  orders: OrderWithRelations[];
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
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");

  const filteredOrders = status === "ALL" 
    ? orders 
    : orders.filter(order => order.status === status);
  return (
    <>      <Tabs defaultValue="ALL" onValueChange={(value) => setStatus(value as any)}>
        <div className="relative mb-4 w-full">
          {/* Indicadores de scroll */}
    
          
          {/* Contenedor con scroll horizontal para móvil */}
          <TabsList className="mb-0 w-full flex-nowrap overflow-x-auto scrollbar-hide">
            <TabsTrigger value="ALL" className="whitespace-nowrap">
              Todos ({counts.ALL})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="whitespace-nowrap">
              Pendientes ({counts.PENDING})
            </TabsTrigger>
            <TabsTrigger value="PROCESSING" className="whitespace-nowrap">
              Procesando ({counts.PROCESSING})
            </TabsTrigger>
            <TabsTrigger value="SHIPPED" className="whitespace-nowrap">
              Enviados ({counts.SHIPPED})
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" className="whitespace-nowrap">
              Entregados ({counts.DELIVERED})
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="whitespace-nowrap">
              Cancelados ({counts.CANCELLED})
            </TabsTrigger>
          </TabsList>
          
          {/* Indicador de scroll para móviles */}
          <div className="mt-1 flex justify-center sm:hidden">
            <div className="h-1 w-16 rounded-full bg-gray-200">
              <div className="h-1 w-6 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>
        
        <TabsContent value={status} className="mt-0">
          <OrderTable orders={filteredOrders} />
        </TabsContent>
      </Tabs>
      
      <OrderInfoDrawer />
    </>
  );
}
