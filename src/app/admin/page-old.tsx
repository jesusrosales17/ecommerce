"use client";

import React, { useState } from "react";
import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import OverviewCards from "@/features/admin/components/OverviewCards";
import RevenueChart from "@/features/admin/components/RevenueChart";
import RecentOrdersTable from "@/features/admin/components/RecentOrdersTable";
import TopProducts from "@/features/admin/components/TopProducts";
import LowStockAlerts from "@/features/admin/components/LowStockAlerts";
import OrderStatusChart from "@/features/admin/components/OrderStatusChart";
import QuickStats from "@/features/admin/components/QuickStats";
import TimeRangeFilter from "@/features/admin/components/TimeRangeFilter";
import RecentActivity from "@/features/admin/components/RecentActivity";
import { RefreshCw, Settings, Bell, Menu, X } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/export";

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleExportPDF = () => {
    if (stats) {
      exportToPDF(stats);
    }
  };

  const handleExportExcel = () => {
    if (stats) {
      exportToExcel(stats);
    }
  };

  const handleTimeRangeChange = (range: string) => {
    console.log("Time range changed:", range);
    // TODO: Implement time range filtering
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
            <div className="h-80 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error al cargar el dashboard
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-2">
                Resumen general de tu tienda en línea
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg border border-gray-200 bg-white">
                <Bell className="w-5 h-5" />
              </button>
              
              <button 
                onClick={refetch}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
              
              <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              
              <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors inline-flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </button>
            </div>          </div>
        </div>        {/* Quick Stats Banner */}
        <QuickStats 
          totalRevenue={stats.overview.totalRevenue}
          totalUsers={stats.overview.totalUsers}
          totalOrders={stats.overview.totalOrders}
          userGrowthPercentage={stats.overview.userGrowthPercentage}
        />        {/* Time Range Filter */}
        <TimeRangeFilter 
          onTimeRangeChange={handleTimeRangeChange}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />

        {/* Overview Cards */}
        <OverviewCards stats={stats.overview} />{/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <RevenueChart data={stats.monthlyStats} />
          </div>
          
          {/* Order Status Chart - Takes 1/3 of the width */}
          <div>
            <OrderStatusChart />
          </div>
        </div>        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
          
          {/* Side panels */}
          <div className="space-y-6">
            <TopProducts products={stats.topProducts} />
            <LowStockAlerts products={stats.lowStockProducts} />
          </div>
        </div>

        {/* Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left hover:bg-blue-100 transition-colors">
                <div className="text-blue-600 font-medium">Agregar Producto</div>
                <div className="text-sm text-blue-500 mt-1">Crear nuevo producto</div>
              </button>
              
              <button className="bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors">
                <div className="text-green-600 font-medium">Ver Órdenes</div>
                <div className="text-sm text-green-500 mt-1">Gestionar pedidos</div>
              </button>
              
              <button className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors">
                <div className="text-purple-600 font-medium">Inventario</div>
                <div className="text-sm text-purple-500 mt-1">Gestionar stock</div>
              </button>
              
              <button className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 transition-colors">
                <div className="text-orange-600 font-medium">Reportes</div>
                <div className="text-sm text-orange-500 mt-1">Ver análisis</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}