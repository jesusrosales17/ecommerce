"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, Filter, Download, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";

interface TimeRangeFilterProps {
  onTimeRangeChange?: (range: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  orderStatus: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

export default function TimeRangeFilter({ 
  onTimeRangeChange, 
  onExportPDF,
  onExportExcel,
  onFiltersChange
}: TimeRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState("7d");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    orderStatus: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  const timeRanges = [
    { value: "7d", label: "7 días", shortLabel: "7d" },
    { value: "30d", label: "30 días", shortLabel: "30d" },
    { value: "3m", label: "3 meses", shortLabel: "3m" },
    { value: "6m", label: "6 meses", shortLabel: "6m" },
    { value: "1y", label: "1 año", shortLabel: "1a" },
    { value: "all", label: "Todo", shortLabel: "Todo" }
  ];

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  const handleExportPDF = () => {
    onExportPDF?.();
    setShowExportMenu(false);
  };
  const handleExportExcel = () => {
    onExportExcel?.();
    setShowExportMenu(false);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      orderStatus: "",
      category: "",
      minPrice: "",
      maxPrice: ""
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange?.(filters);
    setShowFilters(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
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
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
          
          <div className="relative" ref={exportRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3 text-red-500" />
                    Exportar como PDF
                  </button>
                  <button 
                    onClick={handleExportExcel}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-green-500" />
                    Exportar como Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Período</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-3 h-3 mr-1" />
              Filtros
            </button>
            
            <div className="relative" ref={exportRef}>
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="w-3 h-3 mr-1" />
                Exportar
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button 
                      onClick={handleExportPDF}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-3 h-3 mr-2 text-red-500" />
                      PDF
                    </button>
                    <button 
                      onClick={handleExportExcel}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FileSpreadsheet className="w-3 h-3 mr-2 text-green-500" />
                      Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleRangeChange(range.value)}
              className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                selectedRange === range.value
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {range.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado de órdenes
              </label>
              <select 
                value={filters.orderStatus}
                onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="PROCESSING">Procesando</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                <option value="celulares">Celulares</option>
                <option value="computadoras">Computadoras</option>
                <option value="smartwatch">SmartWatch</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rango de precios
              </label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="number" 
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
            <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
            <button 
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
