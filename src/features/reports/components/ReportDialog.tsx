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
import { formmatNumber } from "@/utils/number";

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
            )}
            {summary.totalOrders && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formmatNumber(summary.totalOrders)}
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
            {reportData.topProducts.slice(0, 5).map((product: any, index: number) => (
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
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formmatNumber(product.totalSold)} vendidos</p>
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
            {reportData.topCustomers.slice(0, 5).map((customer: any, index: number) => (
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

        <Separator />

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {renderSummaryCard()}
            
            <div className="grid gap-6">
              {renderTopProducts()}
              {renderTopCustomers()}
              {renderSalesTrends()}
            </div>

            {/* Datos adicionales específicos del reporte */}
            {reportData?.categoryAnalysis && (
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
                            {formattedPrice(category.revenue)}
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
