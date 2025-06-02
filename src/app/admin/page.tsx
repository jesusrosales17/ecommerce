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
import QuickActions from "@/features/admin/components/QuickActions";
import { RefreshCw, Settings, Bell } from "lucide-react";

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

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
            <OrderStatusChart data={stats.orderStatusData} />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Recent Orders - Takes 2/3 of the width on large screens */}
          <div className="2xl:col-span-2">
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
          
          {/* Top Products - Takes 1/3 of the width on large screens */}
          <div className="2xl:col-span-1">
            <TopProducts products={stats.topProducts} />
          </div>
        </div>        {/* Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <RecentActivity activities={stats.recentActivity} />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}