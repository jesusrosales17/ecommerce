"use client";

import React from "react";
import { AlertTriangle, Package, Tag } from "lucide-react";

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  category: { name: string } | null;
}

interface LowStockAlertsProps {
  products: LowStockProduct[];
}

export default function LowStockAlerts({ products }: LowStockAlertsProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Agotado",
        icon: "🚫"
      };
    } else if (stock <= 5) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Crítico",
        icon: "🔴"
      };
    } else {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Bajo",
        icon: "⚠️"
      };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Alertas de Stock Bajo
          </h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Ver inventario
          </button>
        </div>
      </div>

      <div className="p-6">
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-orange-400 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>                      <div className="flex items-center mt-1 space-x-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {product.category?.name || 'Sin categoría'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {product.stock}
                      </div>
                      <div className="text-xs text-gray-500">
                        unidades
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Stock saludable
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Todos los productos tienen stock suficiente.
            </p>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {products.length} producto{products.length !== 1 ? 's' : ''} con stock bajo
            </span>
            <button className="font-medium text-orange-600 hover:text-orange-700">
              Reabastecer todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
