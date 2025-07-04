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
import { formmatNumber } from "@/utils/number";

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
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-1 sm:mt-2 ${trendColors[trend]}`}>
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-2 mr-1" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-2 mr-1" />
              ) : null}
              <span className="text-xs sm:text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg border ${colorClasses[color]} flex-shrink-0`}>
          <Icon className="w-4 h-4 " />
        </div>
      </div>
    </div>
  );
};

export default function OverviewCards({ stats }: OverviewCardsProps) {


  const formatGrowth = (percentage: number) => {
    // const abs = Math.abs(percentage);
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  const getTrend = (percentage: number): "up" | "down" | "neutral" => {
    if (percentage > 0) return "up";
    if (percentage < 0) return "down";
    return "neutral";
  };
      return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
        value={formmatNumber(stats.totalRevenue)}
        icon={DollarSign}
        color="green"
      />
    </div>
  );
}
