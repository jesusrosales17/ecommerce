"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface MonthlyStats {
  month: string;
  orders: number;
  revenue: number;
}

interface RevenueChartProps {
  data: MonthlyStats[];
}

export default function RevenueChart({ data }: RevenueChartProps) {  // Transform and sort data
  const chartData = data
    .map(item => ({
      month: new Date(item.month + "-01").toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit"
      }),
      revenue: isNaN(Number(item.revenue)) ? 0 : Number(item.revenue),
      orders: isNaN(Number(item.orders)) ? 0 : Number(item.orders)
    }))
    .reverse(); // Most recent first in API, but we want chronological order

  const formatCurrency = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) {
      return "$0";
    }
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const revenueValue = payload[0]?.value || 0;
      const ordersValue = payload[1]?.value || 0;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Ingresos: {formatCurrency(revenueValue)}
          </p>
          <p className="text-green-600">
            Órdenes: {ordersValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Tendencia de Ingresos y Órdenes
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Órdenes</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="revenue"
              orientation="left"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="orders"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
