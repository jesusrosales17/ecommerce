"use client";

import React from "react";
import Link from "next/link";
import { Plus, ShoppingBag, Users, BarChart3 } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Agregar Producto",
      description: "Crear nuevo producto",
      href: "/admin/products/new",
      icon: Plus,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-100",
      textColor: "text-blue-600",
      descColor: "text-blue-500"
    },
    {
      title: "Ver Órdenes",
      description: "Gestionar pedidos",
      href: "/admin/orders",
      icon: ShoppingBag,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-100",
      textColor: "text-green-600",
      descColor: "text-green-500"
    },
    {
      title: "Clientes",
      description: "Ver clientes",
      href: "/admin/customers",
      icon: Users,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-100",
      textColor: "text-purple-600",
      descColor: "text-purple-500"
    },
    {
      title: "Reportes",
      description: "Generar reportes",
      href: "/admin/reports",
      icon: BarChart3,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverColor: "hover:bg-orange-100",
      textColor: "text-orange-600",
      descColor: "text-orange-500"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.bgColor} border ${action.borderColor} rounded-lg p-3 sm:p-4 text-left ${action.hoverColor} transition-colors block group`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg ${action.bgColor} border ${action.borderColor} group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-4 h-4 ${action.textColor}`} />
                </div>
                <div className="flex-1">
                  <div className={`${action.textColor} font-medium text-sm sm:text-base`}>
                    {action.title}
                  </div>
                  <div className={`text-xs sm:text-sm ${action.descColor} mt-1`}>
                    {action.description}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
