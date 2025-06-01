"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    userGrowthPercentage: number;
  };
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    itemsCount: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    category: { name: string };
    totalSold: number;
  }>;  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    category: { name: string } | null;
  }>;  monthlyStats: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  orderStatusData: Array<{
    status: string;
    count: number;
    color: string;
  }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
}
