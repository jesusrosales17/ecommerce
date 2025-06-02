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
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-blue-100">
            Aquí tienes un resumen rápido de tu negocio
          </p>
        </div>
        
        <div className="flex items-center space-x-8">
          {/* Revenue */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-2">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{formattedPrice(totalRevenue)}</div>
            <div className="text-sm text-blue-100">Ingresos Totales</div>
          </div>

          {/* Users */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-2">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="text-sm text-blue-100 flex items-center">
              Usuarios
              {userGrowthPercentage !== 0 && (
                <span className={`ml-1 flex items-center text-xs ${
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
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-2">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <div className="text-sm text-blue-100">Órdenes Totales</div>
          </div>
        </div>
      </div>
    </div>
  );
}
