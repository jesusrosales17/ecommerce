import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getSession } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { formatPrice } from "@/utils/price";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

// Helper function to get status badge
const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
    case "PROCESSING":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Procesando</Badge>;
    case "SHIPPED":
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Enviado</Badge>;
    case "DELIVERED":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entregado</Badge>;
    case "CANCELLED":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
};

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/orders");
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      items: true,
      Address: true,
    },
  });

  if (!order) {
    redirect("/orders");
  }

  return (
    <div className="container py-8 px-4 2xl:px-0 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalles del pedido</h1>
        <div className="flex space-x-2">
          {/* <OrderImprimButton />  */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a pedidos
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                Pedido #{order.id.slice(0, 8)}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Fecha: {format(new Date(order.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1">{getStatusBadge(order.status)}</div>
              <div className="text-sm text-muted-foreground">
                ID de pago: {order.paymentId?.slice(0, 12) || "N/A"}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{formatPrice(Number(item.price))}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatPrice(Number(item.price) * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 text-right">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Envío:</span>
                  <span>Gratis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de envío</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Nombre</h3>
                <p>{order.Address.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Dirección</h3>
                <p>{order.Address.street}</p>
                <p>
                  {order.Address.city}, {order.Address.state}, {order.Address.postalCode}
                </p>
                <p>{order.Address.country}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Teléfono</h3>
                <p>{order.Address.phone}</p>
              </div>
              {order.Address.reference && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Referencias</h3>
                  <p className="text-sm">{order.Address.reference}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
