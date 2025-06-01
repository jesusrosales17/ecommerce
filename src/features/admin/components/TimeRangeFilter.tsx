"use client";

import React, { useState } from "react";
import { Calendar, Filter, Download } from "lucide-react";

interface TimeRangeFilterProps {
  onTimeRangeChange?: (range: string) => void;
  onExport?: () => void;
}

export default function TimeRangeFilter({ 
  onTimeRangeChange, 
  onExport 
}: TimeRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState("7d");

  const timeRanges = [
    { value: "7d", label: "Últimos 7 días" },
    { value: "30d", label: "Últimos 30 días" },
    { value: "3m", label: "Últimos 3 meses" },
    { value: "6m", label: "Últimos 6 meses" },
    { value: "1y", label: "Último año" },
    { value: "all", label: "Todo el tiempo" }
  ];

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Rango de tiempo:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleRangeChange(range.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedRange === range.value
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
          
          <button 
            onClick={onExport}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
