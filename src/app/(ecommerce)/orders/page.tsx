import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

import { getSession } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { formatPrice } from "@/utils/price";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";

// Helper function to get status badge
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pendiente
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Procesando
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200"
        >
          Enviado
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Entregado
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Cancelado
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      Address: true,
    },
  });

  return (
    <div className="container py-8 mx-auto px-4 2xl:px-0 min-h-[100dvh]">
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center p-12">
            <p className="text-lg font-medium mb-4">Aún no tienes pedidos</p>
            <p className="text-muted-foreground mb-6">
              Los pedidos que realices aparecerán aquí.
            </p>
            <Button asChild>
              <Link href="/products">Explorar productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link href={`/orders/${order.id}`} className="mb-4" key={order.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Pedido #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        Realizado el{" "}
                        {format(
                          new Date(order.createdAt),
                          "d 'de' MMMM 'de' yyyy",
                          { locale: es }
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="mb-1">{getStatusBadge(order.status)}</div>
                      <CardDescription>
                        Total: {formatPrice(Number(order.total))}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm mb-1">
                        Dirección de envío
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {order.Address.name}, {order.Address.street},{" "}
                        {order.Address.city}, {order.Address.state},{" "}
                        {order.Address.postalCode}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm mb-2">Productos</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">
                              Cantidad
                            </TableHead>
                            <TableHead className="text-right">
                              Subtotal
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-right">
                                {formatPrice(Number(item.price))}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatPrice(
                                  Number(item.price) * item.quantity
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-right font-medium"
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(Number(order.total))}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
