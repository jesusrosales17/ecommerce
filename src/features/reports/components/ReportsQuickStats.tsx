"use client";

import React from "react";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react";

interface QuickStatsProps {
  stats?: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueChange: string;
    ordersChange: string;
    usersChange: string;
    productsChange: string;
    revenueTrend: 'up' | 'down';
    ordersTrend: 'up' | 'down';
    usersTrend: 'up' | 'down';
    productsTrend: 'up' | 'down';
  } | null;
}

export const ReportsQuickStats = ({ stats }: QuickStatsProps) => {
  // Show loading state if stats are not available
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-8 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }  const statsData = [
    {
      label: "Ingresos Totales",
      value: `$${(stats.totalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      change: stats.revenueChange || "0%",
      trend: stats.revenueTrend || 'up',
      icon: DollarSign
    },
    {
      label: "Total Órdenes",
      value: (stats.totalOrders || 0).toLocaleString(),
      change: stats.ordersChange || "0%",
      trend: stats.ordersTrend || 'up',
      icon: ShoppingCart
    },
    {
      label: "Total Usuarios",
      value: (stats.totalUsers || 0).toLocaleString(),
      change: stats.usersChange || "0%",
      trend: stats.usersTrend || 'up',
      icon: Users
    },
    {
      label: "Total Productos",
      value: (stats.totalProducts || 0).toLocaleString(),
      change: stats.productsChange || "0%",
      trend: stats.productsTrend || 'up',
      icon: Package
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <IconComponent className="w-8 h-8 text-gray-400 mb-2" />
                <div className={`flex items-center text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
