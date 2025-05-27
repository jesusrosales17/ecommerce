
import { CustomerClient } from "@/features/customers/components/CustomerClient";
import prisma from "@/libs/prisma";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Clientes | Panel de Administración",
  description: "Administración de clientes registrados",
};

async function getCustomers() {
  // Obtenemos todos los usuarios con rol 'USER' (clientes) y sus direcciones
  const customers = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    include: {
      Address: true, // Cambio de 'addresses' a 'Address' para coincidir con el modelo Prisma
      Order: {       // Cambio de 'orders' a 'Order' para coincidir con el modelo Prisma
        select: {
          id: true,
          total: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return customers;
}

export default async function CustomersPage() {
  const customers = await getCustomers();
  
  // Convert Decimal to number for each order total
  const formattedCustomers = customers.map(customer => ({
    ...customer,
    Order: customer.Order.map(order => ({
      ...order,
      total: Number(order.total)
    }))
  }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <p className="text-muted-foreground">
          Gestiona los clientes registrados en la plataforma
        </p>
      </div>
      
      
      <CustomerClient initialCustomers={formattedCustomers} />
    </div>
  );
}