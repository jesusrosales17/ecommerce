"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Download,
  Calendar,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Printer,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/utils/number";
import { getStatusText } from "@/features/orders/utils/orders";
import Link from "next/link";

export default function ReportPreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener datos del reporte desde los search params o localStorage
  const reportId = searchParams.get("reportId");
  const dateRange = searchParams.get("dateRange");
  // Fetch real data from the API
  const [reportData, setReportData] = React.useState<any>(null);
  const [reportInfo, setReportInfo] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchReportData() {
      if (!reportId || !dateRange) {
        setError("Parámetros de reporte inválidos");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch real report data from API
        const response = await fetch(
          `/api/admin/reports/${reportId}?dateRange=${dateRange}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar el reporte");
        }

        const apiData = await response.json();

        setReportData(apiData.data);
        setReportInfo(getReportInfo(reportId));
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReportData();
  }, [reportId, dateRange]);

  const formatDateRangeText = (range: string) => {
    const ranges: { [key: string]: string } = {
      "7d": "Últimos 7 días",
      "30d": "Últimos 30 días",
      "90d": "Últimos 90 días",
      "1y": "Último año",
    };
    return ranges[range] || range;
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "ventas":
        return <BarChart3 className="h-6 w-6" />;
      case "clientes":
        return <Users className="h-6 w-6" />;
      case "productos":
        return <Package className="h-6 w-6" />;
      case "financiero":
        return <DollarSign className="h-6 w-6" />;
      case "crecimiento":
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };
  const handleDownload = async (format: "pdf" | "excel" | "csv") => {
    try {
      const response = await fetch("/api/admin/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          dateRange,
          format,
          // No enviar data para que use la API directamente y mantenga consistencia
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
      a.download = `reporte-${reportId}-${
        new Date().toISOString().split("T")[0]
      }.${extension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Cargando vista previa del reporte...
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
          <FileText className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Error al cargar el reporte
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>Volver a Reportes</Button>
        </div>
      </div>
    );
  }

  if (!reportData || !reportInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Reporte no encontrado</h2>
          <p className="text-muted-foreground mb-4">
            No se pudieron cargar los datos del reporte solicitado.
          </p>
          <Button onClick={() => router.back()}>Volver a Reportes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">      {/* Header - no se imprime */}
      <div className="print:hidden bg-white sticky top-0 z-10 border-b">
        <div className="mb-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            {/* Left section - Navigation and Title */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:gap-4">
              <Button variant="ghost" asChild className="self-start">
                <Link href="/admin/reports">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Volver a Reportes</span>
                  <span className="sm:hidden">Volver</span>
                </Link>
              </Button>
              
              <Separator orientation="vertical" className="hidden md:block h-6" />
              
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">{getIcon(reportInfo.category)}</div>
                <h1 className="text-lg md:text-xl font-semibold truncate">{reportInfo.title}</h1>
              </div>
            </div>

            {/* Right section - Action buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button variant="outline" onClick={handlePrint} size="sm" className="flex-shrink-0">
                <Printer className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Imprimir</span>
                <span className="sm:hidden">Print</span>
              </Button>
              
              <Button variant="outline" onClick={() => handleDownload("excel")} size="sm" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Excel</span>
                <span className="sm:hidden">XLS</span>
              </Button>
              
              <Button onClick={() => handleDownload("pdf")} size="sm" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>      {/* Contenido del reporte - se imprime */}
      <div className=" print:p-4 mt-4">
        {/* Header del reporte */}
        <div className="mb-8 print:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="print:hidden flex-shrink-0">{getIcon(reportInfo.category)}</div>
            <h1 className="text-2xl sm:text-3xl font-bold print:text-2xl break-words">
              {reportInfo.title}
            </h1>
          </div>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">{reportInfo.description}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
            <Badge variant="outline" className="gap-1 self-start">
              <Calendar className="h-3 w-3" />
              {formatDateRangeText(dateRange || "")}
            </Badge>
            <Badge variant="secondary" className="self-start">
              Generado:{" "}
              {new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Badge>
          </div>
        </div>

        {/* Resumen ejecutivo */}
        {reportData.summary && (
          <Card className="mb-8 print:mb-6 print:shadow-none print:border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resumen Ejecutivo
              </CardTitle>
              <CardDescription>
                Principales métricas del período seleccionado
              </CardDescription>
            </CardHeader>            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 print:gap-4">
                {reportData.summary.totalRevenue && (
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 print:text-xl">
                      {formatCurrency(reportData.summary.totalRevenue)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ingresos Totales
                    </p>
                  </div>
                )}
                {reportData.summary.totalOrders && (
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 print:text-xl">
                      {formatNumber(reportData.summary.totalOrders)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Órdenes
                    </p>
                  </div>
                )}
                {reportData.summary.averageOrderValue && (
                  <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 print:text-xl">
                      {formatCurrency(reportData.summary.averageOrderValue)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ticket Promedio
                    </p>
                  </div>
                )}                {reportData.summary.conversionRate && (
                  <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 print:text-xl">
                      {reportData.summary.conversionRate.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Conversión
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}        {/* Grid de contenido */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 print:gap-6">
          {/* Productos más vendidos */}
          {reportData.topProducts && reportData.topProducts.length > 0 && (
            <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>
                  Top {reportData.topProducts.length} productos del período
                </CardDescription>
              </CardHeader>              <CardContent>
                <div className="space-y-3 sm:space-y-4 print:space-y-2">
                  {reportData.topProducts
                    .slice(0, 10)
                    .map((product: any, index: number) => (
                      <div
                        key={`top-product-${product.id || index}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300 gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Badge
                            variant="secondary"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center print:w-6 print:h-6 flex-shrink-0"
                          >
                            {index + 1}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium print:text-sm text-sm sm:text-base truncate">
                              {product.name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground print:text-xs">
                              {(product.category?.name || product.category || "Sin categoría")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold print:text-sm text-sm sm:text-base">
                            {formatNumber(product.totalSold || product.totalQuantity || 0)} vendidos
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground print:text-xs">
                            {formatCurrency(product.price || product.averagePrice || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Principales clientes */}
          {reportData.topCustomers && reportData.topCustomers.length > 0 && (
            <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <CardHeader>
                <CardTitle>Principales Clientes</CardTitle>
                <CardDescription>
                  Clientes con mayor volumen de compras
                </CardDescription>
              </CardHeader>              <CardContent>
                <div className="space-y-3 sm:space-y-4 print:space-y-2">
                  {reportData.topCustomers
                    .slice(0, 10)
                    .map((customer: any, index: number) => (
                      <div
                        key={`top-customer-${customer.id || index}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300 gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Badge
                            variant="secondary"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center print:w-6 print:h-6 flex-shrink-0"
                          >
                            {index + 1}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium print:text-sm text-sm sm:text-base truncate">
                              {customer.name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground print:text-xs truncate">
                              {customer.email}
                            </p>
                          </div>                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold print:text-sm text-sm sm:text-base">
                            {formatCurrency(customer.totalSpent)}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground print:text-xs">
                            {customer.orderCount} órdenes
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}{" "}
          {/* Análisis por categoría o datos adicionales según el tipo de reporte */}
          {renderAdditionalData()}
        </div>        {/* Footer del reporte */}
        <div className="mt-8 sm:mt-12 print:mt-8 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p className="px-4">
            Este reporte fue generado automáticamente el{" "}
            {new Date().toLocaleDateString("es-ES")} • Datos del período:{" "}
            {formatDateRangeText(dateRange || "")}
          </p>
        </div>
      </div>
    </div>
  );

  // Función para renderizar datos adicionales según el tipo de reporte
  function renderAdditionalData() {
    switch (reportId) {
      case "sales-summary":
        return (
          <>
            {/* Análisis por categoría para ventas */}
            {reportData.salesTrends?.byCategory &&
              reportData.salesTrends.byCategory.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Análisis por Categoría</CardTitle>
                    <CardDescription>
                      Rendimiento de ventas por categoría de productos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 print:gap-2">
                      {reportData.salesTrends.byCategory.map(
                        (category: any, index: number) => (
                          <div
                            key={`sales-category-${category.name || index}`}
                            className="p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                              <p className="font-medium print:text-sm text-sm sm:text-base">
                                {category.name}
                              </p>
                              <Badge
                                variant="outline"
                                className="print:text-xs text-xs sm:text-sm self-start"
                              >
                                {formatCurrency(category.revenue)}
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm print:text-xs">
                              <span className="text-muted-foreground">
                                Cantidad vendida: {formatNumber(category.sales)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        );

      case "customer-analysis":
        return (
          <>
            {/* Análisis de segmentación de clientes */}
            {reportData.segmentation && (
              <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                <CardHeader>
                  <CardTitle>Segmentación de Clientes</CardTitle>
                  <CardDescription>
                    Distribución de clientes por valor de compra
                  </CardDescription>
                </CardHeader>                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 print:gap-2">
                    <div className="p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300 bg-green-50">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600 print:text-lg">
                          {reportData.segmentation.highValue}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Alto Valor (+$1000)
                        </p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300 bg-blue-50">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600 print:text-lg">
                          {reportData.segmentation.mediumValue}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Valor Medio ($500-$1000)
                        </p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg border print:p-2 print:border-gray-300 bg-purple-50">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600 print:text-lg">
                          {reportData.segmentation.lowValue}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Valor Bajo (-$500)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clientes por región */}
            {reportData.customersByRegion &&
              reportData.customersByRegion.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Distribución Geográfica</CardTitle>
                    <CardDescription>Clientes por región</CardDescription>
                  </CardHeader>
                  <CardContent>                    <div className="space-y-2 sm:space-y-3 print:space-y-2">
                      {reportData.customersByRegion.map(
                        (region: any, index: number) => (
                          <div
                            key={`region-${region.region || index}`}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border print:p-2 print:border-gray-300 gap-2 sm:gap-0"
                          >
                            <span className="font-medium print:text-sm text-sm sm:text-base">
                              {region.region}
                            </span>
                            <Badge variant="secondary" className="self-start text-xs sm:text-sm">
                              {region.customerCount} clientes
                            </Badge>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        );

      case "product-performance":
        return (
          <>
            {/* Análisis por categoría de productos */}
            {reportData.categoryAnalysis &&
              reportData.categoryAnalysis.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Rendimiento por Categoría</CardTitle>
                    <CardDescription>
                      Análisis de ventas por categoría de productos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 print:space-y-2">                      {reportData.categoryAnalysis.map(
                        (category: any, index: number) => (
                          <div
                            key={`category-analysis-${category.name || index}`}
                            className="p-4 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium print:text-sm">
                                {category.name}
                              </p>
                              <Badge
                                variant="outline"
                                className="print:text-xs"
                              >
                                {formatCurrency(category.revenue)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm print:text-xs">
                              <span className="text-muted-foreground">
                                Productos: {category.productCount}
                              </span>
                              <span className="text-muted-foreground">
                                Cantidad: {formatNumber(category.quantity)}
                              </span>
                              <span className="text-muted-foreground">
                                Ingresos: {formatCurrency(category.revenue)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Insights de inventario */}
            {reportData.inventoryInsights && (
              <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                <CardHeader>
                  <CardTitle>Estado del Inventario</CardTitle>
                  <CardDescription>
                    Resumen del estado actual del inventario
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 print:text-lg">
                        {reportData.inventoryInsights.lowStock}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stock Bajo
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 print:text-lg">
                        {reportData.inventoryInsights.outOfStock}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sin Stock
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 print:text-lg">
                        {reportData.inventoryInsights.totalActiveProducts}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Productos Activos
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 print:text-lg">
                        {Math.round(reportData.inventoryInsights.averageStock)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stock Promedio
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        );      case "financial-report":
        return (
          <>
            {/* Ventas por categoría */}
            {reportData.salesByCategory && reportData.salesByCategory.length > 0 && (
              <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>
                    Rendimiento de ventas por categoría de productos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 print:space-y-2">                    {reportData.salesByCategory.map(
                      (category: any, index: number) => (
                        <div
                          key={`sales-by-category-${category.category || index}`}
                          className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                        >
                          <div>
                            <p className="font-medium print:text-sm">
                              {category.category}
                            </p>
                            <p className="text-sm text-muted-foreground print:text-xs">
                              {category.totalQuantity} unidades · {category.orderCount} órdenes
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600 print:text-base">
                              {formatCurrency(category.totalSales)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top productos vendidos */}
            {reportData.topProducts &&
              reportData.topProducts.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                    <CardDescription>
                      Los productos con mejores ventas en el período
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 print:space-y-2">                      {reportData.topProducts.slice(0, 10).map(
                        (product: any, index: number) => (
                          <div
                            key={`financial-top-product-${product.id || product.name || index}`}
                            className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="w-8 h-8 rounded-full flex items-center justify-center print:w-6 print:h-6"
                              >
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="font-medium print:text-sm">
                                  {product.name}
                                </p>
                                <p className="text-sm text-muted-foreground print:text-xs">
                                  {product.category} · {product.totalQuantity} unidades
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600 print:text-base">
                                {formatCurrency(product.totalSales)}
                              </p>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                Prom. {formatCurrency(product.averagePrice)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Ventas diarias recientes */}
            {reportData.dailySales &&
              reportData.dailySales.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Ventas Diarias Recientes</CardTitle>
                    <CardDescription>
                      Rendimiento de ventas por día (últimos 10 días)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 print:space-y-2">                      {reportData.dailySales.slice(0, 10).map(
                        (day: any, index: number) => (
                          <div
                            key={`daily-sales-${day.date || index}`}
                            className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div>
                              <p className="font-medium print:text-sm">
                                {new Date(day.date).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                {day.orderCount} órdenes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600 print:text-base">
                                {formatCurrency(day.totalSales)}
                              </p>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                Ticket prom: {formatCurrency(day.orderCount > 0 ? day.totalSales / day.orderCount : 0)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        );      case "orders-analysis":
        return (
          <>
            {/* Estado de órdenes */}
            {reportData.statusBreakdown &&
              reportData.statusBreakdown.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Estado de Órdenes</CardTitle>
                    <CardDescription>
                      Distribución de órdenes por estado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 print:space-y-2">                      {reportData.statusBreakdown.map(
                        (status: any, index: number) => (                          <div
                            key={`status-breakdown-${status.status || index}`}
                            className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div>
                              <p className="font-medium print:text-sm">
                                {getStatusText(status.status)}
                              </p>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                Ingresos: {formatCurrency(status.revenue)}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {status.count} órdenes
                            </Badge>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}            {/* Tendencias diarias */}
            {reportData.dailyTrends &&
              reportData.dailyTrends.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Tendencias Diarias</CardTitle>
                    <CardDescription>
                      Evolución de órdenes por día (últimos 10 días)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 print:space-y-2">                      {reportData.dailyTrends.slice(0, 10).map(
                        (day: any, index: number) => (
                          <div
                            key={`daily-trend-${day.date || index}`}
                            className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                          >
                            <div>
                              <p className="font-medium print:text-sm">
                                {new Date(day.date).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                Ingresos: {formatCurrency(day.revenue || 0)}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-1">
                                {day.orders || 0} órdenes
                              </Badge>
                              <p className="text-sm text-muted-foreground print:text-xs">
                                Ticket prom: {formatCurrency((day.orders && day.orders > 0) ? (day.revenue || 0) / day.orders : 0)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Métricas de procesamiento */}
            {reportData.processingMetrics && (
              <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                <CardHeader>
                  <CardTitle>Métricas de Procesamiento</CardTitle>
                  <CardDescription>
                    Tiempos promedio de procesamiento y entrega
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 print:text-lg">
                        {reportData.processingMetrics.averageProcessingHours}h
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Procesamiento
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 print:text-lg">
                        {reportData.processingMetrics.averageShippingHours}h
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Envío
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 print:text-lg">
                        {reportData.processingMetrics.averageDeliveryDays}d
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Entrega
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}            {/* Distribución por tamaño de órdenes */}
            {reportData.orderSizeDistribution &&
              reportData.orderSizeDistribution.length > 0 && (
                <Card className="print:shadow-none print:border-gray-300 print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle>Distribución por Tamaño de Órdenes</CardTitle>
                    <CardDescription>
                      Análisis de órdenes por rangos de valor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 print:space-y-2">                      {reportData.orderSizeDistribution.map(
                        (size: any, index: number) => {
                          const totalOrders = reportData.orderSizeDistribution.reduce((total: number, item: any) => total + (item.count || 0), 0);
                          const percentage = totalOrders > 0 ? ((size.count || 0) / totalOrders * 100).toFixed(1) : '0.0';
                          
                          return (
                            <div
                              key={`order-size-${size.range || index}`}
                              className="flex items-center justify-between p-3 rounded-lg border print:p-2 print:border-gray-300"
                            >
                              <div>
                                <p className="font-medium print:text-sm">
                                  {size.range}
                                </p>
                                <p className="text-sm text-muted-foreground print:text-xs">
                                  {percentage}% del total
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary" className="mb-1">
                                  {size.count || 0} órdenes
                                </Badge>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        );

     
      default:
        return null;
    }
  }
}

// Funciones auxiliares
function getReportInfo(reportId: string) {
  const reportTypes: { [key: string]: any } = {
    "sales-summary": {
      id: "sales-summary",
      title: "Resumen de Ventas",
      description:
        "Análisis completo del rendimiento de ventas, tendencias y métricas clave.",
      category: "ventas",
    },
    "customer-analysis": {
      id: "customer-analysis",
      title: "Análisis de Clientes",
      description:
        "Segmentación de clientes, comportamiento de compra y análisis de retención.",
      category: "clientes",
    },
    "product-performance": {
      id: "product-performance",
      title: "Rendimiento de Productos",
      description:
        "Análisis detallado del rendimiento por producto, categoría y tendencias.",
      category: "productos",
    },
    "financial-report": {
      id: "financial-report",
      title: "Reporte Financiero",
      description:
        "Estado financiero, márgenes, costos y análisis de rentabilidad.",
      category: "financiero",
    },
    "orders-analysis": {
      id: "orders-analysis",
      title: "Análisis de Órdenes",
      description:
        "Análisis del procesamiento de órdenes, tiempos y eficiencia operativa.",
      category: "operacional",
    },
    
  };

  return reportTypes[reportId] || reportTypes["sales-summary"];
}

