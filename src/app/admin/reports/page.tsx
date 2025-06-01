"use client";

import React, { useState } from "react";
import { FileText, Calendar, RefreshCw } from "lucide-react";
import { useReportsData } from "@/features/reports/hooks/useReportsData";
import { ReportsQuickStats } from "@/features/reports/components/ReportsQuickStats";
import { ReportTypesGrid } from "@/features/reports/components/ReportTypesGrid";
import { ExportOptions } from "@/features/reports/components/ExportOptions";
import { TopProductsCard } from "@/features/reports/components/TopProductsCard";
import { RecentReportsTable } from "@/features/reports/components/RecentReportsTable";

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useReportsData(selectedDateRange);

  const dateRanges = [
    { value: "7d", label: "Últimos 7 días" },
    { value: "30d", label: "Últimos 30 días" },
    { value: "90d", label: "Últimos 3 meses" },
    { value: "1y", label: "Último año" },
    { value: "custom", label: "Rango personalizado" }
  ];
  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: reportId,
          dateRange: selectedDateRange
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Crear un blob con los datos del reporte y descargarlo
        const reportBlob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json'
        });
        
        const url = window.URL.createObjectURL(reportBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportId}-${selectedDateRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(`Reporte "${getReportTitle(reportId)}" generado y descargado exitosamente.`);
        
        // Actualizar la lista de reportes
        refetch();
      } else {
        throw new Error('Error generando el reporte');
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Inténtalo de nuevo.');
    } finally {
      setIsGenerating(null);
    }
  };

  const getReportTitle = (reportId: string) => {
    const titles: { [key: string]: string } = {
      'sales-summary': 'Resumen de Ventas',
      'products-performance': 'Rendimiento de Productos',
      'customer-analytics': 'Análisis de Clientes',
      'inventory-report': 'Reporte de Inventario'
    };
    return titles[reportId] || reportId;
  };
  const handlePreviewReport = async (reportId: string) => {
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: reportId,
          dateRange: selectedDateRange
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Mostrar una vista previa de los datos en una ventana modal o nueva ventana
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        if (previewWindow) {
          previewWindow.document.write(`
            <html>
              <head>
                <title>Vista Previa - ${getReportTitle(reportId)}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #333; border-bottom: 2px solid #333; }
                  pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
                  .summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
              </head>
              <body>
                <h1>Vista Previa: ${getReportTitle(reportId)}</h1>
                <div class="summary">
                  <p><strong>Período:</strong> ${selectedDateRange}</p>
                  <p><strong>Generado:</strong> ${new Date().toLocaleString('es-MX')}</p>
                </div>
                <pre>${JSON.stringify(result.data, null, 2)}</pre>
              </body>
            </html>
          `);
          previewWindow.document.close();
        }
      } else {
        throw new Error('Error generando vista previa');
      }
    } catch (error) {
      console.error('Error en vista previa:', error);
      alert('Error al generar la vista previa. Inténtalo de nuevo.');
    }
  };
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(format);
    
    try {
      const response = await fetch('/api/admin/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          dateRange: selectedDateRange,
          reportType: 'general' // Exportar datos generales por defecto
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Obtener el blob del archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace temporal para descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_general_${selectedDateRange}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xls' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert(`Datos exportados exitosamente en formato ${format.toUpperCase()}.`);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos. Inténtalo de nuevo.');
    } finally {
      setIsExporting(null);
    }
  };if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar reportes</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Reportes y Análisis
              </h1>
              <p className="text-gray-600 mt-2">
                Genera reportes detallados sobre el rendimiento de tu tienda
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={refetch}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
              
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>        {/* Quick Stats */}
        <ReportsQuickStats stats={data?.quickStats} />

        {/* Report Types Grid */}
        <ReportTypesGrid
          onGenerateReport={handleGenerateReport}
          onPreviewReport={handlePreviewReport}
          isGenerating={isGenerating}
        />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Export Options */}
          <ExportOptions
            onExport={handleExport}
            isExporting={isExporting}
          />

          {/* Top Products */}
          <TopProductsCard products={data?.topProducts} />
        </div>        {/* Recent Reports */}
        <RecentReportsTable 
          reports={data?.recentReports}
          onDownload={async (reportName) => {
            try {
              // Simular descarga de reporte existente
              const response = await fetch('/api/admin/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  format: 'pdf',
                  dateRange: '30d',
                  reportType: 'general'
                }),
              });
              
              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportName}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
              }
            } catch (error) {
              console.error('Error descargando:', error);
              alert('Error al descargar el reporte');
            }
          }}
          onView={async (reportName) => {
            try {
              // Generar vista previa del reporte
              const response = await fetch('/api/admin/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reportType: 'sales-summary',
                  dateRange: '30d'
                }),
              });
              
              if (response.ok) {
                const result = await response.json();
                const previewWindow = window.open('', '_blank', 'width=800,height=600');
                if (previewWindow) {
                  previewWindow.document.write(`
                    <html>
                      <head>
                        <title>Vista Previa - ${reportName}</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          h1 { color: #333; }
                          pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
                        </style>
                      </head>
                      <body>
                        <h1>${reportName}</h1>
                        <pre>${JSON.stringify(result.data, null, 2)}</pre>
                      </body>
                    </html>
                  `);
                }
              }
            } catch (error) {
              console.error('Error viendo reporte:', error);
              alert('Error al ver el reporte');
            }
          }}
        />
      </div>
    </div>
  );
}
