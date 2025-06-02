"use client";

import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from "lucide-react";
import { formattedPrice } from "@/utils/price";

interface QuickStatsProps {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  userGrowthPercentage: number;
}

export default function QuickStats({ 
  totalRevenue, 
  totalUsers, 
  totalOrders, 
  userGrowthPercentage 
}: QuickStatsProps) {


  const formatGrowth = (percentage: number) => {
    // const abs = Math.abs(percentage);
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 text-white mb-8 w-full overflow-x-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-blue-100 text-sm sm:text-base">
            Aquí tienes un resumen rápido de tu negocio
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-w-0">
          {/* Revenue */}
          <div className="text-center flex flex-col items-center min-w-0">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg mb-2">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-lg sm:text-2xl font-bold truncate">{formattedPrice(totalRevenue)}</div>
            <div className="text-xs sm:text-sm text-blue-100">Ingresos Totales</div>
          </div>

          {/* Users */}
          <div className="text-center flex flex-col items-center min-w-0">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg mb-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-lg sm:text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-blue-100 flex items-center justify-center">
              <span className="mr-1">Usuarios</span>
              {userGrowthPercentage !== 0 && (
                <span className={`flex items-center text-xs ${
                  userGrowthPercentage > 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {userGrowthPercentage > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatGrowth(userGrowthPercentage)}
                </span>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="text-center flex flex-col items-center min-w-0">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg mb-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-lg sm:text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-blue-100">Órdenes Totales</div>
          </div>
        </div>
      </div>
    </div>
  );
}
