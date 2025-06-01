"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  Download,
  Eye
} from "lucide-react";
import { ReportType } from "../interfaces/reportTypes";
import { Button } from "@/components/ui/button";

interface ReportTypesGridProps {
  onDownloadReport: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  onPreviewReport: (reportId: string) => void;
  isDownloading: string | null;
}

export const ReportTypesGrid = ({ 
  onDownloadReport, 
  onPreviewReport, 
  isDownloading 
}: ReportTypesGridProps) => {
  const reportTypes: ReportType[] = [
    {
      id: "sales-summary",
      title: "Resumen de Ventas",
      description: "Reporte completo de ventas por período seleccionado",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      category: "sales"
    },
    {
      id: "customer-analysis",
      title: "Análisis de Clientes",
      description: "Comportamiento y estadísticas de clientes",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      category: "customers"
    },
    {
      id: "product-performance",
      title: "Rendimiento de Productos",
      description: "Productos más vendidos y análisis de inventario",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      category: "inventory"
    },
    {
      id: "financial-report",
      title: "Reporte Financiero",
      description: "Ingresos, costos y rentabilidad detallada",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      category: "financial"
    },
    {
      id: "orders-analysis",
      title: "Análisis de Órdenes",
      description: "Estado de órdenes y tendencias de pedidos",
      icon: ShoppingCart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      category: "sales"
    },

  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Tipos de Reportes Disponibles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <div
              key={report.id}
              className={`bg-white rounded-lg border ${report.borderColor} p-6 hover:shadow-lg relative transition-all duration-200 transform hover:-translate-y-1`}
            >
              <div className=" space-x-4">
                <div className={`${report.bgColor} p-3 rounded-lg flex-shrink-0 w-11 h-10 mr-auto absolute right-3 top-3`}>
                  <IconComponent className={`w-6 h-6 ${report.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {report.description}
                  </p>
                    <div className="flex flex-col space-y-2">
                    {/* Botón de vista previa */}
                    <button
                      onClick={() => onPreviewReport(report.id)}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Vista Previa
                    </button>
                    
                    {/* Botones de descarga */}
                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => onDownloadReport(report.id, 'pdf')}
                        disabled={isDownloading === `${report.id}-pdf`}
                        className={`flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center justify-center text-xs font-medium ${
                          isDownloading === `${report.id}-pdf` ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isDownloading === `${report.id}-pdf` ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => onDownloadReport(report.id, 'excel')}
                        disabled={isDownloading === `${report.id}-excel`}
                        className={`flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center text-xs font-medium ${
                          isDownloading === `${report.id}-excel` ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isDownloading === `${report.id}-excel` ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>

                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" />
                            Excel
                          </>
                        )}
                      </button>
                      
                      {/* <button
                        onClick={() => onDownloadReport(report.id, 'csv')}
                        disabled={isDownloading === `${report.id}-csv`}
                        className={`flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center text-xs font-medium ${
                          isDownloading === `${report.id}-csv` ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isDownloading === `${report.id}-csv` ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Download className="w-3 h-3 mr-1" />
                            CSV
                          </>
                        )}
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
