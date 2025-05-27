'use client';

import { formattedPrice } from "@/utils/price";
import { ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/features/orders/store/useOrderStore";
import { OrderWithRelations } from "@/features/orders/interfaces/order";

interface Order {
  id: string;
  total: number;
  createdAt: Date;
}

interface CustomerOrdersSummaryProps {
  orders: Order[];
}

export function CustomerOrdersSummary({ orders = [] }: CustomerOrdersSummaryProps) {
  const {setOrderToShow, setIsOpenInfoDrawer} = useOrderStore();
  // Verificamos que orders sea un array
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  // Calculamos el total gastado por el cliente
  const totalSpent = safeOrders.reduce((acc, order) => acc + Number(order.total), 0);
  
  // Ordenamos los pedidos por fecha más reciente primero
  const sortedOrders = [...safeOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  
  // Tomamos solo los últimos 5 pedidos para mostrar
  const recentOrders = sortedOrders.slice(0, 5);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Historial de Pedidos</h3>
        <div className="text-sm font-medium">
          Total gastado: {formattedPrice(totalSpent)}
        </div>
      </div>
      
      {safeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <ShoppingBag className="mb-2 h-12 w-12 text-muted-foreground/50" />
          <p>Este cliente no ha realizado ningún pedido aún</p>
        </div>
      ) : (        <>
          <div className="text-sm text-muted-foreground">
            Mostrando los últimos {Math.min(5, safeOrders.length)} de {safeOrders.length} pedidos
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "PPP", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">{formattedPrice(Number(order.total))}</TableCell>
                  <TableCell>
                    <Link
                    href={`/admin/orders/`}
                    
                    passHref>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {orders.length > 5 && (
            <div className="flex justify-center">
              <Link href={`/admin/orders?customer=${orders[0]?.id}`} passHref>
                <Button variant="outline">Ver todos los pedidos</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
