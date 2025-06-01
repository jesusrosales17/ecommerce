"use client";

import React, { useState } from "react";
import { FileText, Calendar, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReportsData } from "@/features/reports/hooks/useReportsData";
import { ReportsQuickStats } from "@/features/reports/components/ReportsQuickStats";
import { ReportTypesGrid } from "@/features/reports/components/ReportTypesGrid";
import { ExportOptions } from "@/features/reports/components/ExportOptions";
import { TopProductsCard } from "@/features/reports/components/TopProductsCard";
import { RecentReportsTable } from "@/features/reports/components/RecentReportsTable";
import { ReportDialog } from "@/features/reports/components/ReportDialog";
import { toast } from "sonner";

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentReportData, setCurrentReportData] = useState<any>(null);
  const [currentReportInfo, setCurrentReportInfo] = useState<any>(null);
  const { data, isLoading, error, refetch } = useReportsData(selectedDateRange);
  const router = useRouter();

  const dateRanges = [
    { value: "7d", label: "Últimos 7 días" },
    { value: "30d", label: "Últimos 30 días" },
    { value: "90d", label: "Últimos 3 meses" },
    { value: "1y", label: "Último año" },
    { value: "custom", label: "Rango personalizado" },
  ];

  // Función que genera un reporte específico basado en su ID
  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);

    try {
      // Obtener información específica del reporte según su tipo
      const reportInfo = getReportInfo(reportId);

      // Enviar la solicitud al servidor para generar el reporte
      const response = await fetch("/api/admin/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          reportType: reportInfo.category,
          dateRange: selectedDateRange,
          filters: reportInfo.defaultFilters,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Mostrar el reporte en el dialog
      setCurrentReportData(result.data);
      setCurrentReportInfo(reportInfo);
      setReportDialogOpen(true);
      toast.success(
        `Reporte generado exitosamente: ${reportInfo.title} ha sido generado para el período seleccionado.`
      );
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado."
      );
    } finally {
      setIsGenerating(null);
    }
  };
  // Función para descargar directamente un reporte sin mostrar el diálogo
  const handleDownloadReport = async (
    reportId: string,
    format: "pdf" | "excel" | "csv"
  ) => {
    setIsDownloading(`${reportId}-${format}`);

    try {
      // Obtener información específica del reporte según su tipo
      const reportInfo = getReportInfo(reportId);

      // Llamar directamente a la API de exportación con el reportId
      // Esto hará que use el mismo endpoint que la vista previa para mantener consistencia
      const exportResponse = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          dateRange: selectedDateRange,
          reportId: reportInfo.id,
          // No enviar customData para que la API obtenga los datos directamente
        }),
      });

      if (!exportResponse.ok) throw new Error("Error al descargar");

      const blob = await exportResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Usar la extensión correcta para Excel
      const extension = format === "excel" ? "xlsx" : format;
      a.download = `${reportInfo.id}-${selectedDateRange}-${
        new Date().toISOString().split("T")[0]
      }.${extension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Descarga iniciada: El reporte ${
          reportInfo.title
        } en formato ${format.toUpperCase()} se está descargando.`
      );
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado al descargar el reporte."
      );
    } finally {
      setIsDownloading(null);
    }
  };
  const handleDownloadFromDialog = async (format: "pdf" | "excel" | "csv") => {
    if (!currentReportInfo) return;

    setIsDownloading(format);

    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          dateRange: selectedDateRange,
          reportId: currentReportInfo.id,
          // No enviar customData para que obtenga datos frescos de la API
        }),
      });

      if (!response.ok) throw new Error("Error al descargar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // Usar la extensión correcta para Excel
      const extension = format === "excel" ? "xlsx" : format;
      a.download = `${currentReportInfo.id}-${selectedDateRange}-${
        new Date().toISOString().split("T")[0]
      }.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(
        `Descarga iniciada: El reporte en formato ${format.toUpperCase()} se está descargando.`
      );
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("No se pudo descargar el reporte. Inténtalo de nuevo.");
    } finally {
      setIsDownloading(null);
    }
  };

  // Función para vista previa del reporte
  const handlePreviewReport = (reportId?: string) => {
    // If reportId is provided, use it; otherwise use currentReportInfo
    const reportInfo = reportId ? getReportInfo(reportId) : currentReportInfo;
    if (!reportInfo) return;

    const params = new URLSearchParams({
      reportId: reportInfo.id,
      dateRange: selectedDateRange,
    });

    // Guardar datos en sessionStorage para la página de preview
    sessionStorage.setItem(
      "reportPreviewData",
      JSON.stringify({
        data: reportId ? null : currentReportData, // If direct preview, no data yet
        info: reportInfo,
        dateRange: selectedDateRange,
      })
    );

    // Abrir en nueva pestaña
    window.open(`/admin/reports/preview?${params.toString()}`, "_blank");
  };

  // Función para exportar datos generales en diferentes formatos
  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    if (!data) return;

    setIsExporting(format);

    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          dateRange: selectedDateRange,
          customData: data,
        }),
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `reporte-general-${selectedDateRange}-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(
        `Exportación completada: Los datos han sido exportados en formato ${format.toUpperCase()}.`
      );
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("No se pudieron exportar los datos. Inténtalo de nuevo.");
    } finally {
      setIsExporting(null);
    }
  };

  const formatDateRange = (range: string): string => {
    const ranges: { [key: string]: string } = {
      "7d": "Últimos 7 días",
      "30d": "Últimos 30 días",
      "90d": "Últimos 3 meses",
      "1y": "Último año",
    };
    return ranges[range] || range;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Cargando datos de reportes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Error al cargar reportes
          </h2>
          <p className="text-muted-foreground mb-4">
            No se pudieron cargar los datos de reportes. Por favor, inténtalo de
            nuevo.
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reportes y Analytics
          </h1>
          <p className="text-muted-foreground">
            Genera reportes detallados y analiza el rendimiento de tu negocio
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm bg-background"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-input rounded-md text-sm bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualizar
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <ReportsQuickStats stats={data?.quickStats} />

      {/* Main Content Grid */}
        {/* Left Column */}
        {/* Report Types Grid */}{" "}
        <ReportTypesGrid
          onDownloadReport={handleDownloadReport}
          onPreviewReport={handlePreviewReport}
          isDownloading={isDownloading}
        />
        {/* Top Products */}
        {/* Right Column */}
        {/* <div className="space-y-8">
          Export Options
          <ExportOptions
            onExport={handleExport}
            isExporting={isExporting}
          />
          
          
        </div> */}

        <TopProductsCard products={data?.topProducts || []} />

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        reportData={currentReportData}
        reportInfo={currentReportInfo}
        dateRange={selectedDateRange}
        onDownload={handleDownloadFromDialog}
        onPreview={handlePreviewReport}
        isDownloading={isDownloading}
      />
    </div>
  );
}

// Función auxiliar para obtener información del reporte
function getReportInfo(reportId: string) {
  const reportTypes: { [key: string]: any } = {
    "sales-summary": {
      id: "sales-summary",
      title: "Resumen de Ventas",
      description:
        "Análisis completo del rendimiento de ventas, tendencias y métricas clave.",
      category: "ventas",
      defaultFilters: [],
    },
    "customer-analysis": {
      id: "customer-analysis",
      title: "Análisis de Clientes",
      description:
        "Segmentación de clientes, comportamiento de compra y análisis de retención.",
      category: "clientes",
      defaultFilters: [],
    },
    "product-performance": {
      id: "product-performance",
      title: "Rendimiento de Productos",
      description:
        "Análisis detallado del rendimiento por producto, categoría y tendencias.",
      category: "productos",
      defaultFilters: [],
    },
    "financial-report": {
      id: "financial-report",
      title: "Reporte Financiero",
      description:
        "Estado financiero, márgenes, costos y análisis de rentabilidad.",
      category: "financiero",
      defaultFilters: [],
    },
    "orders-analysis": {
      id: "orders-analysis",
      title: "Análisis de Órdenes",
      description:
        "Análisis del procesamiento de órdenes, tiempos y eficiencia operativa.",
      category: "operacional",
      defaultFilters: [],
    },
  };

  return reportTypes[reportId] || reportTypes["sales-summary"];
}
