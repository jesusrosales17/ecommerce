'use client'
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus } from "@prisma/client";
import { Order } from "../store/useOrderStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Check, Clock, Edit, Eye, MoreVertical, Package, ShoppingBag, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState, useMemo } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { formattedPrice } from "@/utils/price";

interface Props {
  orders: Order[];
}

export function OrderTable({ orders }: Props) {
  const {
    setIsOpenInfoDrawer,
    setOrderToShow,
    changeOrderStatus,
  } = useOrderStore();
 
  const [searchQuery, setSearchQuery] = useState("");

  const handleShowOrder = (order: Order) => {
    setIsOpenInfoDrawer(true);
    setOrderToShow(order);
  };

  const handleChangeStatus = async (order: Order, status: OrderStatus) => {
    try {
      await changeOrderStatus(order.id, status);
    } catch (error) {
      console.error("Error al cambiar el estado del pedido:", error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);
    // Función para obtener el color del badge según el estado
  const getBadgeVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
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
  const getStatusText = (status: OrderStatus) => {
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

  return (
    <div className="">      <SearchInput
          placeholder="Buscar pedido por ID"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classname="mb-4"
        />
      <div className="rounded-md border" >
        <Table >          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No hay pedidos para mostrar
                </TableCell>
              </TableRow>
            ) : (              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{formattedPrice(Number(order.total))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getBadgeVariant(order.status)}
                      className="uppercase"
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell width={100}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="w-8 h-8">
                          <MoreVertical width={20} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleShowOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Edit className="mr-2 h-4 w-4" />
                            Cambiar estado
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order, "PENDING")}>
                                <Clock className="mr-2 h-4 w-4" />
                                Pendiente
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order, "PROCESSING")}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Procesando
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order, "SHIPPED")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Enviado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order, "DELIVERED")}>
                                <Check className="mr-2 h-4 w-4" />
                                Entregado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order, "CANCELLED")}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelado
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

