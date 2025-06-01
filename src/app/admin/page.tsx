"use client";

import React from "react";
import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import OverviewCards from "@/features/admin/components/OverviewCards";
import RevenueChart from "@/features/admin/components/RevenueChart";
import RecentOrdersTable from "@/features/admin/components/RecentOrdersTable";
import TopProducts from "@/features/admin/components/TopProducts";
import OrderStatusChart from "@/features/admin/components/OrderStatusChart";
import QuickStats from "@/features/admin/components/QuickStats";
import RecentActivity from "@/features/admin/components/RecentActivity";
import { RefreshCw, Settings, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen  p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24 mb-2"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-12 sm:w-16"></div>
                </div>
              ))}
            </div>
            <div className="h-60 sm:h-80 bg-gray-200 rounded mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="h-60 sm:h-96 bg-gray-200 rounded"></div>
              <div className="h-60 sm:h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar el dashboard
            </h2>
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!stats) return null;

  return (
    <div className="min-h-screen ">
      <div className=" ">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Resumen general de tu tienda en línea
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-3">
              {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg border border-gray-200 bg-white">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
               */}
              <button 
                onClick={refetch}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 sm:px-4 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
              
              <button className="bg-blue-600 text-white rounded-lg px-3 py-2 sm:px-4 hover:bg-blue-700 transition-colors inline-flex items-center text-sm">
                <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Configurar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <QuickStats 
          totalRevenue={stats.overview.totalRevenue}
          totalUsers={stats.overview.totalUsers}
          totalOrders={stats.overview.totalOrders}
          userGrowthPercentage={stats.overview.userGrowthPercentage}
        />

        {/* Overview Cards */}
        <OverviewCards stats={stats.overview} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Chart - Takes 2/3 of the width on large screens */}
          <div className="2xl:col-span-2">
            <RevenueChart data={stats.monthlyStats} />
          </div>
          
          {/* Order Status Chart - Takes 1/3 of the width on large screens */}
          <div className="2xl:col-span-1">
            <OrderStatusChart />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Recent Orders - Takes 2/3 of the width on large screens */}
          <div className="xl:col-span-2">
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
          
          {/* Top Products - Takes 1/3 of the width on large screens */}
          <div className="xl:col-span-1">
            <TopProducts products={stats.topProducts} />
          </div>
        </div>

        {/* Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-left hover:bg-blue-100 transition-colors">
                <div className="text-blue-600 font-medium text-sm sm:text-base">Agregar Producto</div>
                <div className="text-xs sm:text-sm text-blue-500 mt-1">Crear nuevo producto</div>
              </button>
              
              <button className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-left hover:bg-green-100 transition-colors">
                <div className="text-green-600 font-medium text-sm sm:text-base">Ver Órdenes</div>
                <div className="text-xs sm:text-sm text-green-500 mt-1">Gestionar pedidos</div>
              </button>
              
              <button className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-left hover:bg-purple-100 transition-colors">
                <div className="text-purple-600 font-medium text-sm sm:text-base">Clientes</div>
                <div className="text-xs sm:text-sm text-purple-500 mt-1">Ver clientes</div>
              </button>
              
              <button className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-left hover:bg-orange-100 transition-colors">
                <div className="text-orange-600 font-medium text-sm sm:text-base">Reportes</div>
                <div className="text-xs sm:text-sm text-orange-500 mt-1">Generar reportes</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}