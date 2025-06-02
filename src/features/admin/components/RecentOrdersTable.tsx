"use client";

import React from "react";
import { Eye, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { formatPrice } from "@/utils/price";
import { formatDate, formatDateShort } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/features/orders/store/useOrderStore";
import Link from "next/link";

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const router = useRouter();
  const { setOrderToShow, setIsOpenInfoDrawer } = useOrderStore();
  const handleViewOrder = async (order: RecentOrder) => {
    try {
      // Navegar a la página de órdenes
      router.push("/admin/orders");

      // Establecer la orden temporal y abrir el drawer (con casting para tipo temporal)
      const temporaryOrder = {
        id: order.id,
        total: order.total.toString(),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
        userId: "",
        addressId: "",
        paymentId: "",
        paymentStatus: "PENDING" as const,
        User: {
          name: order.customerName,
          email: order.customerEmail,
        },
        Address: null,
        items: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // Casting temporal - se actualizará con datos completos

      setOrderToShow(temporaryOrder);
      setIsOpenInfoDrawer(true);

      // Cargar los detalles completos en segundo plano
      const response = await fetch(`/api/admin/orders/${order.id}`);
      if (response.ok) {
        const fullOrder = await response.json();
        setOrderToShow(fullOrder);
      } else {
        console.error("Error loading order details");
      }
    } catch (error) {
      console.error("Error handling view order:", error);
    }
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "Pendiente",
      },
      PROCESSING: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package,
        label: "Procesando",
      },
      SHIPPED: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Package,
        label: "Enviado",
      },
      DELIVERED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Entregado",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Cancelado",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">{config.label}</span>
        <span className="sm:hidden">{config.label.slice(0, 3)}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Órdenes Recientes
          </h3>
          <Button asChild variant={"ghost"} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            <Link href="/admin/orders" className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
                Ver todas las órdenes
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {orders.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Package className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay órdenes recientes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Las órdenes aparecerán aquí cuando se realicen.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      {order.itemsCount}{" "}
                      {order.itemsCount === 1 ? "item" : "items"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.itemsCount}{" "}
                    {order.itemsCount === 1 ? "item" : "items"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant={"ghost"}
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay órdenes recientes
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Las órdenes aparecerán aquí cuando se realicen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
