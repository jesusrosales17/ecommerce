import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Eye, X, FileText, BarChart3, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import { formattedPrice } from "@/utils/price";
import { formatCurrency, formatNumber } from "@/utils/number";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportData: any;
  reportInfo: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  dateRange: string;
  onDownload: (format: 'pdf' | 'excel' | 'csv') => void;
  onPreview: () => void;
  isDownloading: string | null;
}

export function ReportDialog({
  open,
  onOpenChange,
  reportData,
  reportInfo,
  dateRange,
  onDownload,
  onPreview,
  isDownloading
}: ReportDialogProps) {
  // Early return if reportInfo is null to prevent errors
  if (!reportInfo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Cargando reporte...</DialogTitle>
            <DialogDescription>
              Por favor espere mientras se genera el reporte.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDateRangeText = (range: string) => {
    const ranges: { [key: string]: string } = {
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días',
      '1y': 'Último año'
    };
    return ranges[range] || range;
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'ventas': return <BarChart3 className="h-5 w-5" />;
      case 'clientes': return <Users className="h-5 w-5" />;
      case 'productos': return <Package className="h-5 w-5" />;
      case 'financiero': return <DollarSign className="h-5 w-5" />;
      case 'crecimiento': return <TrendingUp className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };
  const renderSummaryCard = () => {
    if (!reportData?.summary) return null;

    const summary = reportData.summary;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getIcon(reportInfo?.category || 'default')}
            Resumen Ejecutivo
          </CardTitle>
          <CardDescription>
            Principales métricas del período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summary.totalRevenue && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formattedPrice(summary.totalRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              </div>
            )}            {summary.totalOrders && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(summary.totalOrders)}
                </div>
                <p className="text-sm text-muted-foreground">Órdenes</p>
              </div>
            )}
            {summary.averageOrderValue && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formattedPrice(summary.averageOrderValue)}
                </div>
                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
              </div>
            )}
            {summary.conversionRate && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.conversionRate.toFixed(2)}%
                </div>
                <p className="text-sm text-muted-foreground">Conversión</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  const renderTopProducts = () => {
    if (!reportData?.topProducts || reportData.topProducts.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>
            Top {reportData.topProducts.length} productos del período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.topProducts.slice(0, 10).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name || 'Sin categoría'}
                    </p>
                  </div>
                </div>                <div className="text-right">
                  <p className="font-semibold">{formatNumber(product.totalSold)} vendidos</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  const renderTopCustomers = () => {
    if (!reportData?.topCustomers || reportData.topCustomers.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Principales Clientes</CardTitle>
          <CardDescription>
            Clientes con mayor volumen de compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.topCustomers.slice(0, 10).map((customer: any, index: number) => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formattedPrice(customer.totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.orderCount} órdenes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  const renderSalesTrends = () => {
    if (!reportData?.salesTrends) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Ventas</CardTitle>
          <CardDescription>
            Evolución de las ventas en el período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {reportData.salesTrends.growth && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  reportData.salesTrends.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reportData.salesTrends.growth >= 0 ? '+' : ''}{reportData.salesTrends.growth.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Crecimiento</p>
              </div>
            )}
            {reportData.salesTrends.bestDay && (
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {reportData.salesTrends.bestDay.date}
                </div>
                <p className="text-sm text-muted-foreground">Mejor Día</p>
                <p className="text-xs text-muted-foreground">
                  {formattedPrice(reportData.salesTrends.bestDay.sales)}
                </p>
              </div>
            )}
            {reportData.salesTrends.averageDailySales && (
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {formattedPrice(reportData.salesTrends.averageDailySales)}
                </div>
                <p className="text-sm text-muted-foreground">Promedio Diario</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Función para renderizar contenido específico según el tipo de reporte
  const renderSpecificReportContent = () => {
    switch (reportInfo.id) {
      case 'sales-summary':
        return renderSalesSpecificContent();
      case 'customer-analysis':
        return renderCustomerSpecificContent();
      case 'product-performance':
        return renderProductSpecificContent();
      case 'financial-report':
        return renderFinancialSpecificContent();
      case 'orders-analysis':
        return renderOrdersSpecificContent();
      case 'growth-trends':
        return renderGrowthSpecificContent();
      default:
        return null;
    }
  };
  // Contenido específico para reporte de ventas
  const renderSalesSpecificContent = () => (
    <>
      {reportData.salesTrends?.byCategory && reportData.salesTrends.byCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis por Categoría</CardTitle>
            <CardDescription>
              Rendimiento de ventas por categoría de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.salesTrends.byCategory.map((category: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{category?.name || 'Sin nombre'}</p>
                    <Badge variant="outline">
                      {formatCurrency(category?.revenue || 0)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cantidad vendida: {formatNumber(category?.sales || 0)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
  // Contenido específico para análisis de clientes
  const renderCustomerSpecificContent = () => (
    <>
      {reportData.segmentation && (
        <Card>
          <CardHeader>
            <CardTitle>Segmentación de Clientes</CardTitle>
            <CardDescription>
              Distribución de clientes por valor de compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(reportData.segmentation?.highValue || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Alto Valor (+$1000)</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(reportData.segmentation?.mediumValue || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Valor Medio ($500-$1000)</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(reportData.segmentation?.lowValue || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Valor Bajo (-$500)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData.customersByRegion && reportData.customersByRegion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribución Geográfica</CardTitle>
            <CardDescription>
              Clientes por región
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.customersByRegion.map((region: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">{region?.region || 'Sin región'}</span>
                  <Badge variant="secondary">{formatNumber(region?.customerCount || 0)} clientes</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Contenido específico para rendimiento de productos
  const renderProductSpecificContent = () => (
    <>
      {reportData.categoryAnalysis && reportData.categoryAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Categoría</CardTitle>
            <CardDescription>
              Análisis de ventas por categoría de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">              {reportData.categoryAnalysis.map((category: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{category?.name || 'Sin nombre'}</p>
                    <Badge variant="outline">
                      {formatCurrency(category?.revenue || 0)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Productos: {formatNumber(category?.productCount || 0)}</span>
                    <span className="text-muted-foreground">Cantidad: {formatNumber(category?.quantity || 0)}</span>
                    <span className="text-muted-foreground">Ingresos: {formatCurrency(category?.revenue || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}      {reportData.inventoryInsights && (
        <Card>
          <CardHeader>
            <CardTitle>Estado del Inventario</CardTitle>
            <CardDescription>
              Resumen del estado actual del inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatNumber(reportData.inventoryInsights?.lowStock || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Stock Bajo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(reportData.inventoryInsights?.outOfStock || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Sin Stock</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(reportData.inventoryInsights?.totalActiveProducts || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Productos Activos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(Math.round(reportData.inventoryInsights?.averageStock || 0))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Stock Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Contenido específico para reporte financiero
  const renderFinancialSpecificContent = () => (
    <>
      {reportData.expenses && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Gastos</CardTitle>
            <CardDescription>
              Desglose de gastos operativos
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(reportData.expenses?.operationalCosts || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Costos Operativos</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {formatCurrency(reportData.expenses?.marketingCosts || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Marketing</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(reportData.expenses?.shippingCosts || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Envíos</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {formatCurrency(reportData.expenses?.otherCosts || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Otros</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData.profitMargins && reportData.profitMargins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Márgenes de Beneficio</CardTitle>
            <CardDescription>
              Análisis de rentabilidad por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="space-y-3">
              {reportData.profitMargins.map((margin: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{margin?.category || 'Sin categoría'}</p>
                    <p className="text-sm text-muted-foreground">
                      Beneficio: {formatCurrency(margin?.profit || 0)}
                    </p>
                  </div>
                  <Badge variant={(margin?.margin || 0) > 20 ? "default" : (margin?.margin || 0) > 10 ? "secondary" : "destructive"}>
                    {(margin?.margin || 0).toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Contenido específico para análisis de órdenes
  const renderOrdersSpecificContent = () => (
    <>
      {reportData.statusBreakdown && reportData.statusBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estado de Órdenes</CardTitle>
            <CardDescription>
              Distribución de órdenes por estado
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="space-y-3">
              {reportData.statusBreakdown.map((status: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium capitalize">{status?.status?.toLowerCase() || 'Sin estado'}</p>
                    <p className="text-sm text-muted-foreground">
                      Ingresos: {formatCurrency(status?.revenue || 0)}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatNumber(status?.count || 0)} órdenes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {reportData.processingMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Procesamiento</CardTitle>
            <CardDescription>
              Tiempos promedio de procesamiento y entrega
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(reportData.processingMetrics?.averageProcessingHours || 0)}h
                </div>
                <p className="text-sm text-muted-foreground mt-1">Procesamiento</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(reportData.processingMetrics?.averageShippingHours || 0)}h
                </div>
                <p className="text-sm text-muted-foreground mt-1">Envío</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(reportData.processingMetrics?.averageDeliveryDays || 0)}d
                </div>
                <p className="text-sm text-muted-foreground mt-1">Entrega</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // Contenido específico para tendencias de crecimiento
  const renderGrowthSpecificContent = () => (
    <>
      {reportData.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Crecimiento</CardTitle>
            <CardDescription>
              Tasas de crecimiento comparativo
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(reportData.summary?.revenueGrowth || 0) > 0 ? '+' : ''}{(reportData.summary?.revenueGrowth || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ingresos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(reportData.summary?.orderGrowth || 0) > 0 ? '+' : ''}{(reportData.summary?.orderGrowth || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Órdenes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(reportData.summary?.customerGrowth || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Nuevos Clientes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(reportData.summary?.monthOverMonthGrowth || 0) > 0 ? '+' : ''}{(reportData.summary?.monthOverMonthGrowth || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Mes a Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData.projections && (
        <Card>
          <CardHeader>
            <CardTitle>Proyecciones</CardTitle>
            <CardDescription>
              Estimaciones para el próximo período
            </CardDescription>
          </CardHeader>
          <CardContent>            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(reportData.projections?.nextMonthRevenue || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ingresos Proyectados</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {formatNumber(Math.round(reportData.projections?.nextMonthOrders || 0))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Órdenes Proyectadas</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {formatNumber(reportData.projections?.confidence || 0)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Confianza</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">        <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl">
                {getIcon(reportInfo?.category || 'default')}
                {reportInfo?.title || 'Reporte'}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4">
                <span>{reportInfo?.description || 'Generando reporte...'}</span>
                <Badge variant="outline">
                  {formatDateRangeText(dateRange)}
                </Badge>
                <Badge variant="secondary">
                  Generado: {new Date().toLocaleDateString('es-ES')}
                </Badge>
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Separator />        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {renderSummaryCard()}
            
            <div className="grid gap-6">
              {renderTopProducts()}
              {renderTopCustomers()}
              {renderSalesTrends()}
              
              {/* Contenido específico según el tipo de reporte */}
              {renderSpecificReportContent()}
            </div>

            {/* Datos adicionales genéricos - solo si no hay contenido específico */}
            {!reportInfo.id && reportData?.categoryAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Análisis por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportData.categoryAnalysis.map((category: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{category.name}</p>
                          <Badge variant="outline">
                            {formatCurrency(category.revenue)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.products} productos • {category.sales} ventas
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="p-6 pt-4">
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              onClick={onPreview}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Vista Previa
            </Button>
            
            <div className="flex-1" />
            
            <Button
              variant="outline"
              onClick={() => onDownload('csv')}
              disabled={isDownloading === 'csv'}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading === 'csv' ? 'Descargando...' : 'CSV'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onDownload('excel')}
              disabled={isDownloading === 'excel'}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading === 'excel' ? 'Descargando...' : 'Excel'}
            </Button>
            
            <Button
              onClick={() => onDownload('pdf')}
              disabled={isDownloading === 'pdf'}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading === 'pdf' ? 'Descargando...' : 'PDF'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
