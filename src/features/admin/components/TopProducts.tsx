"use client";

import React from "react";
import { TrendingUp, Package, DollarSign, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopProduct {
  id: string;
  name: string;
  price: number;
  category: { name: string };
  totalSold: number;
}

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateRevenue = (price: number, sold: number) => {
    return price * sold;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Productos Más Vendidos
          </h3>
          <Button
            asChild
            variant={"ghost"}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Link href="/admin/products" className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Ver todas los productos
            </Link>
          </Button>
        </div>
      </div>      <div className="p-0">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendidos
                  </th>                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600">
                        <Package className="w-4 h-4 mr-1" />
                        <span className="font-medium">{product.totalSold}</span>
                      </div>
                    </td>                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end text-sm font-semibold text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>
                          {formatCurrency(
                            calculateRevenue(product.price, product.totalSold)
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Link href={`/admin/products/${product.id}`} className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay datos de ventas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Los productos más vendidos aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
