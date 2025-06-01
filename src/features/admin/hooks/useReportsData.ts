"use client";

import { useState, useEffect } from "react";

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface TopProduct {
  id: string;
  name: string;
  price: number;
  category: { name: string };
  totalSold: number;
}

interface RecentReport {
  name: string;
  type: string;
  date: string;
  status: string;
}

interface ReportsData {
  quickStats: QuickStat[];
  topProducts: TopProduct[];
  recentReports: RecentReport[];
  dateRange: string;
  periodInfo: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export function useReportsData(dateRange: string = '30d') {
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/reports?dateRange=${dateRange}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos de reportes');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
}