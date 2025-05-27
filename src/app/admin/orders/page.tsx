

import { OrdersList } from "@/features/orders/components/OrdersList";
import prisma from "@/libs/prisma";

export const metadata = {
  title: "Pedidos",
  description: "Administra los pedidos de tu tienda",
};

const OrdersPage = async () => {
  // Obtener pedidos desde el servidor directamente
  const ordersData = await prisma.order.findMany({
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
              id: true,
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
   
  // Convertir los decimales a strings para serialización
  const orders = ordersData.map(order => ({
    ...order,
    total: order.total.toString(),
    items: order.items.map(item => ({
      ...item,
      price: item.price.toString()
    }))
  }));

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
        <OrdersList orders={orders} />
      </div>
    </>
  );
};

export default OrdersPage;

