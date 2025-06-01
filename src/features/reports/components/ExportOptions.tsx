"use client";

import React from "react";
import { FileText, BarChart3, PieChart, Download } from "lucide-react";

interface ExportOptionsProps {
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  isExporting: string | null;
}

export const ExportOptions = ({ onExport, isExporting }: ExportOptionsProps) => {
  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Reportes formateados para impresión',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100'
    },
    {
      id: 'excel',
      name: 'Excel',
      description: 'Datos tabulares para análisis',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'csv',
      name: 'CSV',
      description: 'Datos en formato separado por comas',
      icon: PieChart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Opciones de Exportación
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportFormats.map((format) => {
          const IconComponent = format.icon;
          const isLoading = isExporting === format.id;
          
          return (
            <div 
              key={format.id}
              className={`border ${format.borderColor} rounded-lg p-4 text-center`}
            >
              <IconComponent className={`w-8 h-8 ${format.color} mx-auto mb-2`} />
              <h4 className="font-medium text-gray-900 mb-1">{format.name}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {format.description}
              </p>
              <button 
                onClick={() => onExport(format.id as 'pdf' | 'excel' | 'csv')}
                disabled={isLoading}
                className={`w-full ${format.bgColor} ${format.color} px-3 py-2 rounded border ${format.borderColor} ${format.hoverColor} transition-colors text-sm font-medium ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    Exportando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar {format.name}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
