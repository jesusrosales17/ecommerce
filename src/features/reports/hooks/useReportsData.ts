"use client";

import { useState, useEffect } from "react";
import { ReportData } from "../interfaces/reportTypes";

export function useReportsData(dateRange: string = '30d') {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/reports?dateRange=${dateRange}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const reportsData = await response.json();
      setData(reportsData);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const refetch = () => {
    fetchReports();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
}
