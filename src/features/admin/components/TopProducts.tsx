"use client";

import React from "react";
import { TrendingUp, Package, DollarSign } from "lucide-react";

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

export default function TopProducts({ products }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD"
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
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Ver todos
          </button>
        </div>
      </div>

      <div className="p-6">
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.category.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-1" />
                    <span className="font-medium">{product.totalSold}</span>
                    <span className="ml-1">vendidos</span>
                  </div>
                  
                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatCurrency(calculateRevenue(product.price, product.totalSold))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
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
