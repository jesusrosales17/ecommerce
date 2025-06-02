"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface OrderStatusChartProps {
  data?: OrderStatusData[];
}

export default function OrderStatusChart({ data = [] }: OrderStatusChartProps) {
  // Default mock data for demonstration if no real data is provided
  const defaultData: OrderStatusData[] = [
    { status: "PENDING", count: 45, color: "#f59e0b" },
    { status: "PROCESSING", count: 30, color: "#3b82f6" },
    { status: "SHIPPED", count: 20, color: "#6366f1" },
    { status: "DELIVERED", count: 85, color: "#10b981" },
    { status: "CANCELLED", count: 5, color: "#ef4444" }
  ];

  const chartData = data.length > 0 ? data : defaultData;
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendiente", icon: Clock },
      PROCESSING: { label: "Procesando", icon: Package },
      SHIPPED: { label: "Enviado", icon: Truck },
      DELIVERED: { label: "Entregado", icon: CheckCircle },
      CANCELLED: { label: "Cancelado", icon: XCircle }
    };
    return statusConfig[status as keyof typeof statusConfig] || { label: status, icon: Package };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {getStatusInfo(data.status).label}
          </p>
          <p className="text-sm text-gray-600">
            {data.count} órdenes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Estado de Órdenes
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status List */}
        <div className="space-y-3">
          {chartData.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            const Icon = statusInfo.icon;
            const percentage = ((item.count / total) * 100).toFixed(1);
            
            return (
              <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {statusInfo.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total de órdenes</span>
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
