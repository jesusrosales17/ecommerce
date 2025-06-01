"use client";

import React from "react";
import { useDashboardStats } from "@/features/admin/hooks/useDashboardStats";
import OverviewCards from "@/features/admin/components/OverviewCards";
import { RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useDashboardStats();

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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Resumen de tu negocio</p>
          </div>
          <button 
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
        </div>

        {/* Overview Cards */}
        <OverviewCards stats={stats.overview} />

        {/* Additional sections will be added here */}
        <div className="mt-8 text-center text-gray-500">
          <p>Más componentes del dashboard se añadirán próximamente...</p>
        </div>
      </div>
    </div>
  );
}
