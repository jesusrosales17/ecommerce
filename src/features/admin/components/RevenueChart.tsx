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

export default function RevenueChart({ data }: RevenueChartProps) {  // Function to safely convert revenue to number
  const parseRevenue = (revenue: any): number => {
    console.log("Raw revenue:", revenue, typeof revenue);
    
    // If it's already a number
    if (typeof revenue === 'number') {
      return revenue;
    }
    
    // If it's a string, try to parse it
    if (typeof revenue === 'string') {
      const parsed = parseFloat(revenue);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // If it's a Prisma Decimal object
    if (revenue && typeof revenue === 'object') {
      try {
        // Try calling toString() method first (Prisma Decimal has this method)
        if (typeof revenue.toString === 'function') {
          const stringValue = revenue.toString();
          const parsed = parseFloat(stringValue);
          if (!isNaN(parsed)) {
            console.log("Parsed via toString():", parsed);
            return parsed;
          }
        }
          // If it's a Prisma Decimal object with d, e, s properties
        if (revenue.d && Array.isArray(revenue.d)) {
          console.log("Decimal object:", { d: revenue.d, e: revenue.e, s: revenue.s });
          
          // For Prisma Decimal format {s: sign, e: exponent, d: [digits]}
          // The value is calculated as: sign * (d[0] / 10^(d[0].toString().length - 1 - e))
          // But more simply, we can reconstruct the decimal string and parse it
          
          const sign = revenue.s || 1; // 1 for positive, -1 for negative
          const digits = revenue.d[0] || 0;
          const exponent = revenue.e || 0;
          
          // Convert digits to string to get the number of digits
          const digitsStr = digits.toString();
          const numDigits = digitsStr.length;
          
          // Calculate the actual decimal position
          // e represents the position of the decimal point from the right
          const decimalPosition = numDigits - 1 - exponent;
          
          let valueStr = digitsStr;
          if (decimalPosition > 0) {
            // Insert decimal point
            valueStr = digitsStr.slice(0, decimalPosition) + '.' + digitsStr.slice(decimalPosition);
          } else if (decimalPosition < 0) {
            // Add zeros to the left
            valueStr = '0.' + '0'.repeat(-decimalPosition) + digitsStr;
          }
          
          const result = sign * parseFloat(valueStr);
          console.log("Parsed decimal result:", { valueStr, result });
          
          return result;
        }
        
        // Try direct conversion to string as fallback
        const stringValue = String(revenue);
        const parsed = parseFloat(stringValue);
        if (!isNaN(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing Decimal revenue:", error);
      }
    }
    
    return 0;
  };

  console.log("RevenueChart data:", data);
  
  const chartData = data
    .map(item => {
      const revenue = parseRevenue(item.revenue);
      const orders = isNaN(Number(item.orders)) ? 0 : Number(item.orders);
      
      console.log("Parsed item:", { 
        month: item.month, 
        originalRevenue: item.revenue, 
        parsedRevenue: revenue, 
        orders 
      });
      
      return {
        month: new Date(item.month + "-01").toLocaleDateString("es-ES", {
          month: "short",
          year: "2-digit"
        }),
        revenue,
        orders
      };
    })
    .reverse(); // Most recent first in API, but we want chronological order
  const formatCurrency = (value: number) => {
    if (isNaN(value) || value === null || value === undefined) {
      return "$0";
    }
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const CustomTooltip = ({ active, payload, label }: any) => {

    console.log(payload)
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
