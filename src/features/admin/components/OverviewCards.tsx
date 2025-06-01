"use client";

import React from "react";
import {
  Users,
  Package,
  ShoppingCart,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers
} from "lucide-react";

interface OverviewStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  userGrowthPercentage: number;
}

interface OverviewCardsProps {
  stats: OverviewStats;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue"
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "yellow" | "purple" | "red" | "indigo";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 ${trendColors[trend]}`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : trend === "down" ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : null}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function OverviewCards({ stats }: OverviewCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const formatGrowth = (percentage: number) => {
    const abs = Math.abs(percentage);
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  const getTrend = (percentage: number): "up" | "down" | "neutral" => {
    if (percentage > 0) return "up";
    if (percentage < 0) return "down";
    return "neutral";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Usuarios"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        trend={getTrend(stats.userGrowthPercentage)}
        trendValue={formatGrowth(stats.userGrowthPercentage)}
        color="blue"
      />
      
      <StatCard
        title="Productos Activos"
        value={stats.totalProducts.toLocaleString()}
        icon={Package}
        color="green"
      />
      
      <StatCard
        title="Categorías"
        value={stats.totalCategories.toLocaleString()}
        icon={Layers}
        color="purple"
      />
      
      <StatCard
        title="Total Órdenes"
        value={stats.totalOrders.toLocaleString()}
        icon={ShoppingCart}
        color="indigo"
      />
      
      <StatCard
        title="Órdenes Pendientes"
        value={stats.pendingOrders.toLocaleString()}
        icon={Clock}
        color="yellow"
      />
      
      <StatCard
        title="Ingresos Totales"
        value={formatCurrency(stats.totalRevenue)}
        icon={DollarSign}
        color="green"
      />
    </div>
  );
}
