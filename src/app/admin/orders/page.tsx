

import { OrderTable } from "@/features/orders/components/OrderTable";
import prisma from "@/libs/prisma";
import { OrdersClient } from "./orders-client";

export const metadata = {
  title: "Pedidos",
  description: "Administra los pedidos de tu tienda",
};

const OrdersPage = async () => {
  

  // Obtener pedidos desde el servidor directamente
  const orders = await prisma.order.findMany({
    include: {
      User: {
        select: {
          name: true,
          email: true,
        },
      },
      Address: true,
      items: {
        include: {
          Product: {
            select: {
              name: true,
              images: {
                where: {
                  isPrincipal: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Contamos los pedidos por estado para mostrar en las pestañas
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === "PENDING").length,
    PROCESSING: orders.filter(o => o.status === "PROCESSING").length,
    SHIPPED: orders.filter(o => o.status === "SHIPPED").length,
    DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
    CANCELLED: orders.filter(o => o.status === "CANCELLED").length,
  };

  return (
    <>
      <div className="flex md:justify-between gap-4 md:items-center mb-5 flex-col md:flex-row">
        <div>
          <h1 className="text-xl">Pedidos</h1>
          <p className="text-sm text-gray-500">
            Administra los pedidos de la tienda
          </p>
        </div>
      </div>
      
      <div className="container-fluid px-0">
        <OrdersClient orders={orders} counts={counts} />
      </div>
    </>
  );
};

export default OrdersPage;

