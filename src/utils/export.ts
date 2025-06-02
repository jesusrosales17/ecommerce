import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getStatusText } from '@/features/orders/utils/orders';
import { OrderStatus } from '@prisma/client';

export interface ExportData {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    userGrowthPercentage: number;
  };
  recentOrders: Array<{ 
    id: string;
    total: number;
    status: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    itemsCount: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    category: { name: string };
    totalSold: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    category: { name: string } | null;
  }>;
  monthlyStats: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
}

// Interface para datos de reportes específicos
export interface ReportData {
  quickStats?: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueChange: string;
    ordersChange: string;
    usersChange: string;
    productsChange: string;
    revenueTrend: 'up' | 'down';
    ordersTrend: 'up' | 'down';
    usersTrend: 'up' | 'down';
    productsTrend: 'up' | 'down';
  };
  topProducts?: Array<{
    id: string;
    name: string;
    price: number;
    category: { name: string } | null;
    totalSold: number;
  }>;
  recentReports?: Array<{
    name: string;
    type: string;
    date: string;
    status: string;
  }>;
  monthlyStats?: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  orderStatusData?: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  // Para reportes específicos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summary?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  salesTrends?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topCustomers?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryAnalysis?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // Título del documento
  doc.setFontSize(20);
  doc.text('Reporte del Dashboard', 14, 22);
  
  // Fecha del reporte
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 32);
  
  let currentY = 45;
  
  // Resumen general
  doc.setFontSize(16);
  doc.text('Resumen General', 14, currentY);
  currentY += 10;
  
  const overviewData = [
    ['Total Usuarios', data.overview.totalUsers.toString()],
    ['Total Productos', data.overview.totalProducts.toString()],
    ['Total Categorías', data.overview.totalCategories.toString()],
    ['Total Órdenes', data.overview.totalOrders.toString()],
    ['Órdenes Pendientes', data.overview.pendingOrders.toString()],
    ['Ingresos Totales', `$${data.overview.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`],
    ['Crecimiento de Usuarios', `${data.overview.userGrowthPercentage.toFixed(1)}%`]
  ];
  
  autoTable(doc, {
    startY: currentY,
    head: [['Métrica', 'Valor']],
    body: overviewData,
    theme: 'grid',
    styles: { fontSize: 10 }  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // Productos más vendidos
  if (data.topProducts.length > 0) {
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductsData = data.topProducts.map(product => [
      product.name,
      product.category.name,
      `$${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      product.totalSold.toString()
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Producto', 'Categoría', 'Precio', 'Vendidos']],
      body: topProductsData,
      theme: 'striped',
      styles: { fontSize: 9 }    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Nueva página para órdenes recientes
  if (data.recentOrders.length > 0) {
    doc.addPage();
    currentY = 20;
      doc.setFontSize(16);    doc.text('Órdenes Recientes', 14, currentY);
    currentY += 5;
    
    const ordersData = data.recentOrders.map(order => [
      order.id.substring(0, 8) + '...',
      order.customerName,
      order.customerEmail,
      `$${order.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString('es-ES')
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha']],
      body: ordersData,
      theme: 'striped',
      styles: { fontSize: 8 }
    });
  }
  
  // Guardar el PDF
  doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportToExcel = async (data: ExportData, dateRange: string, reportId?: string) => {  // Si tenemos reportId, obtener los datos completos del mismo endpoint que usa la vista previa
  let completeData = data;
  if (reportId) {
    try {
      // Usar el mismo endpoint que usa la vista previa para obtener TODOS los datos
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/reports/${reportId}?dateRange=${dateRange}`);
      if (response.ok) {
        const apiResponse = await response.json();
        completeData = apiResponse.data;
      }
    } catch (error) {
      console.error('Error fetching complete report data for Excel:', error);
      // Si falla, usar los datos originales
    }
  }

  const workbook = XLSX.utils.book_new();
    // Hoja de resumen
  const overviewData = [
    ['Métrica', 'Valor'],
    ['Total Usuarios', completeData.overview?.totalUsers || 0],
    ['Total Productos', completeData.overview?.totalProducts || 0],
    ['Total Categorías', completeData.overview?.totalCategories || 0],
    ['Total Órdenes', completeData.overview?.totalOrders || 0],
    ['Órdenes Pendientes', completeData.overview?.pendingOrders || 0],
    ['Ingresos Totales', completeData.overview?.totalRevenue || 0],
    ['Crecimiento de Usuarios (%)', completeData.overview?.userGrowthPercentage || 0]
  ];
  
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Resumen');
    // Hoja de productos más vendidos
  if (completeData.topProducts && completeData.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Total Vendidos'],
      ...completeData.topProducts.map(product => [
        product.name,
        product.category.name,
        product.price,
        product.totalSold
      ])
    ];
    
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }    // Hoja de órdenes recientes
  if (completeData.recentOrders && completeData.recentOrders.length > 0) {    const ordersData = [
      ['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha'],
      ...completeData.recentOrders.map(order => [
        order.id,
        order.customerName,
        order.customerEmail,        order.total,
        getStatusText(order.status as OrderStatus),
        new Date(order.createdAt).toLocaleDateString('es-ES')
      ])
    ];
    
    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Órdenes');
  }
  
  // Hoja de productos con stock bajo
  if (data.lowStockProducts.length > 0) {
    const lowStockData = [
      ['Producto', 'Categoría', 'Stock'],
      ...data.lowStockProducts.map(product => [
        product.name,
        product.category?.name || 'Sin categoría',
        product.stock
      ])
    ];
    
    const lowStockSheet = XLSX.utils.aoa_to_sheet(lowStockData);
    XLSX.utils.book_append_sheet(workbook, lowStockSheet, 'Stock Bajo');
  }
  
  // Hoja de estadísticas mensuales
  if (data.monthlyStats.length > 0) {
    const monthlyData = [
      ['Mes', 'Órdenes', 'Ingresos'],
      ...data.monthlyStats.map(stat => [
        stat.month,
        stat.orders,
        stat.revenue
      ])
    ];
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Estadísticas');
  }
  
  // Guardar el archivo Excel
  XLSX.writeFile(workbook, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Nueva función para generar PDF como Buffer para reportes específicos
export const generatePDFReport = async (data: ReportData, dateRange: string, reportId?: string): Promise<Buffer> => {
  // Los datos ya vienen completos del endpoint, no necesitamos volver a buscarlos
  const completeData = data;

  const doc = new jsPDF();
  
  // Título del documento
  doc.setFontSize(20);
  const title = reportId ? getReportTitle(reportId) : 'Reporte General';
  doc.text(title, 14, 22);
  
  // Fecha del reporte
  doc.setFontSize(12);
  doc.text(`Período: ${formatDateRangeText(dateRange)}`, 14, 32);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 42);
  
  let currentY = 55;  
  // Generar contenido específico según el tipo de reporte
  if (reportId && completeData) {
    switch (reportId) {
      case 'sales-summary':
        currentY = await addSalesSummaryContent(doc, completeData, currentY);
        break;
      case 'customer-analysis':
        currentY = await addCustomerAnalysisContent(doc, completeData, currentY);
        break;
      case 'product-performance':
        currentY = await addProductPerformanceContent(doc, completeData, currentY);
        break;
      case 'financial-report':
        currentY = await addFinancialReportContent(doc, completeData, currentY);
        break;      case 'orders-analysis':
        currentY = await addOrdersAnalysisContent(doc, completeData, currentY);
        break;
      default:
        // Fallback para reportes generales
        currentY = await addGeneralReportContent(doc, completeData, currentY);
        break;    }
  } else {
    // Fallback para reportes sin tipo específico
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentY = await addGeneralReportContent(doc, completeData, currentY);
  }
  
  // Convertir a Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};

// Nueva función para generar Excel como Buffer
export const generateExcelReport = async (data: ReportData, dateRange: string, reportId?: string): Promise<Buffer> => {
  // Usar los datos proporcionados sin hacer solicitudes adicionales
  const completeData = data;
  const workbook = XLSX.utils.book_new();
  
  // Generar hojas específicas según el tipo de reporte
  if (reportId && completeData) {
    switch (reportId) {
      case 'sales-summary':
        addSalesSummaryExcelSheets(workbook, completeData);
        break;
      case 'customer-analysis':
        addCustomerAnalysisExcelSheets(workbook, completeData);
        break;
      case 'product-performance':
        addProductPerformanceExcelSheets(workbook, completeData);
        break;
      case 'financial-report':
        addFinancialReportExcelSheets(workbook, completeData);
        break;      case 'orders-analysis':
        addOrdersAnalysisExcelSheets(workbook, completeData);
        break;
      default:
        addGeneralExcelSheets(workbook, completeData);
        break;
    }
  } else {
    addGeneralExcelSheets(workbook, completeData);
  }
  
  // Convertir a Buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
};

// Nueva función para generar CSV como Buffer
export const generateCSVReport = async (data: ReportData, dateRange: string, reportId?: string): Promise<Buffer> => {
  // Usar los datos proporcionados sin hacer solicitudes adicionales
  const completeData = data;

  let csvContent = '';
  
  // Encabezado
  const title = reportId ? getReportTitle(reportId) : 'Reporte General';
  csvContent += `${title}\n`;
  csvContent += `Período: ${formatDateRangeText(dateRange)}\n`;
  csvContent += `Generado: ${new Date().toLocaleDateString('es-ES')}\n\n`;
  
  // Generar contenido específico según el tipo de reporte
  if (reportId && completeData) {
    switch (reportId) {
      case 'sales-summary':
        csvContent += generateSalesSummaryCSV(completeData);
        break;
      case 'customer-analysis':
        csvContent += generateCustomerAnalysisCSV(completeData);
        break;
      case 'product-performance':
        csvContent += generateProductPerformanceCSV(completeData);
        break;
      case 'financial-report':
        csvContent += generateFinancialReportCSV(completeData);
        break;      case 'orders-analysis':
        csvContent += generateOrdersAnalysisCSV(completeData);
        break;
      default:
        csvContent += generateGeneralCSV(completeData);        break;
    }
  } else {
    csvContent += generateGeneralCSV(completeData);
  }
  
  return Buffer.from(csvContent, 'utf-8');
};

// Funciones auxiliares
function getReportTitle(reportId: string): string {
  const titles: { [key: string]: string } = {
    'sales-summary': 'Reporte de Resumen de Ventas',
    'customer-analysis': 'Reporte de Análisis de Clientes',
    'product-performance': 'Reporte de Rendimiento de Productos',
    'financial-report': 'Reporte Financiero',
    'orders-analysis': 'Reporte de Análisis de Órdenes',
  };
  return titles[reportId] || 'Reporte Personalizado';
}

function formatDateRangeText(range: string): string {
  const ranges: { [key: string]: string } = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
    '1y': 'Último año'
  };
  return ranges[range] || range;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addSalesSummaryContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen ejecutivo
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen Ejecutivo', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Total de Ingresos', `$${data.summary.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Total de Órdenes', data.summary.totalOrders?.toString() || '0'],
      ['Valor Promedio por Orden', `$${data.summary.averageOrderValue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Tasa de Conversión', `${data.summary.conversionRate || 0}%`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductsData = data.topProducts.slice(0, 10).map((product: any) => [
      product.name || 'N/A',
      product.category?.name || 'Sin categoría',
      `$${product.price?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      product.totalSold?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Producto', 'Categoría', 'Precio', 'Vendidos']],
      body: topProductsData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Mejores Clientes', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any    
    const topCustomersData = data.topCustomers.slice(0, 10).map((customer: any) => [
      customer.name || 'N/A',
      customer.email || 'N/A',
      `$${customer.totalSpent?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      customer.orderCount?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Cliente', 'Email', 'Total Gastado', 'Órdenes']],
      body: topCustomersData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Ventas por categoría
  if (data.salesTrends?.byCategory && data.salesTrends.byCategory.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Ventas por Categoría', 14, currentY);
    currentY += 5;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryData = data.salesTrends.byCategory.map((category: any) => [
      category.name || 'N/A',
      `$${category.revenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      category.sales?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Categoría', 'Ingresos', 'Unidades Vendidas']],
      body: categoryData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
      doc.setFontSize(16);
    doc.text('Estado de Órdenes', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any   
    const orderStatusData = data.orderStatus.map((status: any) => [
      getStatusText(status.status as OrderStatus) || 'N/A',
      status.count?.toString() || '0',
      `$${status.revenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Estado', 'Cantidad', 'Ingresos']],
      body: orderStatusData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
    return currentY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addCustomerAnalysisContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen de clientes
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen de Clientes', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Total de Clientes', data.summary.totalCustomers?.toString() || '0'],
      ['Nuevos Clientes', data.summary.newCustomers?.toString() || '0'],
      ['Tasa de Repetición', `${data.summary.repeatCustomerRate?.toFixed(2) || 0}%`],
      ['Valor Promedio de Vida', `$${data.summary.averageLifetimeValue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Principales Clientes', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topCustomersData = data.topCustomers.slice(0, 10).map((customer: any, index: number) => [
      (index + 1).toString(),
      customer.name || 'N/A',
      customer.email || 'N/A',
      `$${customer.totalSpent?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      customer.orderCount?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Cliente', 'Email', 'Total Gastado', 'Órdenes']],
      body: topCustomersData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Segmentación de clientes
  if (data.segmentation) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Segmentación de Clientes', 14, currentY);
    currentY += 5;
    
    const segmentationData = [
      ['Alto Valor (+$1000)', data.segmentation.highValue?.toString() || '0'],
      ['Valor Medio ($500-$1000)', data.segmentation.mediumValue?.toString() || '0'],
      ['Valor Bajo (-$500)', data.segmentation.lowValue?.toString() || '0']
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Segmento', 'Cantidad de Clientes']],
      body: segmentationData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }

  // Distribución geográfica
  if (data.customersByRegion && data.customersByRegion.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Distribución Geográfica', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regionData = data.customersByRegion.map((region: any) => [
      region.region || 'Sin especificar',
      region.customerCount?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Región', 'Cantidad de Clientes']],
      body: regionData,
      theme: 'grid',
    styles: { fontSize: 10 }
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentY = (doc as any).lastAutoTable.finalY + 15;
  }
    return currentY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addProductPerformanceContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen de productos
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen de Productos', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Total de Productos', data.summary.totalProducts?.toString() || '0'],
      ['Productos Activos', data.summary.activeProducts?.toString() || '0'],
      ['Ingresos Totales', `$${data.summary.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Unidades Vendidas', data.summary.totalUnitsSold?.toString() || '0']
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
    // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductsData = data.topProducts.slice(0, 10).map((product: any, index: number) => [
      (index + 1).toString(),
      product.name || 'N/A',
      product.category?.name || 'Sin categoría',
      `$${product.price?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      product.totalSold?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Producto', 'Categoría', 'Precio', 'Vendidos']],
      body: topProductsData,
      theme: 'striped',
      styles: { fontSize: 8 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Análisis por categoría
  if (data.categoryAnalysis && data.categoryAnalysis.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Rendimiento por Categoría', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryData = data.categoryAnalysis.map((category: any) => [
      category.name || 'N/A',
      category.productCount.toString() || '0',
      `$${category.revenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      category.quantity?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Categoría', 'Productos', 'Ingresos', 'Unidades Vendidas']],
      body: categoryData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Insights de inventario
  if (data.inventoryInsights) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Estado del Inventario', 14, currentY);
    currentY += 10;
    
    const inventoryData = [
      ['Productos con Stock Bajo', data.inventoryInsights.lowStock?.toString() || '0'],
      ['Productos Sin Stock', data.inventoryInsights.outOfStock?.toString() || '0'],
      ['Total Productos Activos', data.inventoryInsights.totalActiveProducts?.toString() || '0'],
      ['Stock Promedio', data.inventoryInsights.averageStock?.toFixed(1) || '0']
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: inventoryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addFinancialReportContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen Ejecutivo
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen Ejecutivo', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Ingresos Totales', `$${data.summary.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Total de Órdenes', data.summary.totalOrders?.toString() || '0'],
      ['Ticket Promedio', `$${data.summary.averageOrderValue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Crecimiento', `${data.summary.salesGrowth || 0}%`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Ventas por Categoría
  if (data.salesByCategory && data.salesByCategory.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Ventas por Categoría', 14, currentY);
    currentY += 10;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryData = data.salesByCategory.map((category: any) => [
      category.category || 'N/A',
      `$${category.totalSales?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      category.totalQuantity?.toString() || '0',
      category.orderCount?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Categoría', 'Ventas Totales', 'Unidades', 'Órdenes']],
      body: categoryData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
    // Top Productos Vendidos
  if (data.topProducts && data.topProducts.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 10;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productData = data.topProducts.map((product: any, index: number) => [
      (index + 1).toString(),
      product.name || 'N/A',
      product.category || 'Sin categoría',
      `$${product.totalSales?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      product.totalQuantity?.toString() || '0',
      `$${product.averagePrice?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Producto', 'Categoría', 'Ventas Totales', 'Unidades', 'Precio Promedio']],
      body: productData,
      theme: 'striped',
      styles: { fontSize: 8 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Ventas Diarias (últimos 10 días)
  if (data.dailySales && data.dailySales.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Ventas Diarias Recientes', 14, currentY);
    currentY += 10;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyData = data.dailySales.slice(0, 10).map((day: any) => [
      day.date || 'N/A',
      `$${day.totalSales?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      day.orderCount?.toString() || '0',
      day.orderCount > 0 ? `$${(day.totalSales / day.orderCount)?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}` : '$0.00'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Fecha', 'Ventas Totales', 'Órdenes', 'Ticket Promedio']],
      body: dailyData,
      theme: 'grid',
      styles: { fontSize: 9 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addOrdersAnalysisContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Estado de órdenes (usando statusBreakdown)
  if (data.statusBreakdown && data.statusBreakdown.length > 0) {
    doc.setFontSize(16);
    doc.text('Distribución por Estado de Órdenes', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
      // Tabla de estado de órdenes
    const orderStatusHeaders = ['Estado', 'Cantidad', 'Ingresos'];    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderStatusData = data.statusBreakdown.map((status: any) => [
      getStatusText(status.status as OrderStatus) || 'N/A',
      status.count?.toString() || '0',
      `$${(status.revenue || 0).toLocaleString('es-ES')}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [orderStatusHeaders],
      body: orderStatusData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [74, 144, 226] },
      margin: { left: 14, right: 14 }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any   
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Tendencias diarias (usando dailyTrends)
  if (data.dailyTrends && data.dailyTrends.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Tendencias Diarias (Últimos 10 días)', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const trendsHeaders = ['Fecha', 'Órdenes', 'Ingresos'];    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trendsData = data.dailyTrends.slice(0, 10).map((trend: any) => [
      trend.date || 'N/A',
      trend.orders?.toString() || '0',
      `$${(trend.revenue || 0).toLocaleString('es-ES')}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [trendsHeaders],
      body: trendsData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [74, 144, 226] },
      margin: { left: 14, right: 14 }
    });
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Métricas de procesamiento (usando processingMetrics)
  if (data.processingMetrics) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Métricas de Procesamiento', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const metricsHeaders = ['Métrica', 'Valor'];
    const metricsData = [
      ['Tiempo Promedio de Procesamiento', `${data.processingMetrics.averageProcessingHours || 0} horas`],
      ['Tiempo Promedio de Envío', `${data.processingMetrics.averageShippingHours || 0} horas`],
      ['Días Promedio de Entrega', `${data.processingMetrics.averageDeliveryDays || 0} días`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [metricsHeaders],
      body: metricsData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [74, 144, 226] },
      margin: { left: 14, right: 14 }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Distribución por tamaño de orden (usando orderSizeDistribution)
  if (data.orderSizeDistribution && data.orderSizeDistribution.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Distribución por Tamaño de Orden', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const sizeHeaders = ['Rango', 'Cantidad de Órdenes']; 
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sizeData = data.orderSizeDistribution.map((size: any) => [
      size.range || 'N/A',
      size.count?.toString() || '0'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [sizeHeaders],
      body: sizeData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [74, 144, 226] },
      margin: { left: 14, right: 14 }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addGeneralReportContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen rápido si existe
  if (data.quickStats || (data.summary && Object.keys(data.summary).length > 0)) {
    doc.setFontSize(16);
    doc.text('Resumen Ejecutivo', 14, currentY);
    currentY += 10;
    
    const statsToShow = data.quickStats || data.summary;
    const quickStatsData = [
      ['Total de Ingresos', `$${(statsToShow.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`],
      ['Total de Órdenes', (statsToShow.totalOrders || 0).toString()],
      ['Total de Usuarios', (statsToShow.totalUsers || statsToShow.totalCustomers || 0).toString()],
      ['Total de Productos', (statsToShow.totalProducts || 0).toString()]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: quickStatsData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Top productos si existen
  if (data.topProducts && data.topProducts.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
      doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topProductsData = data.topProducts.slice(0, 10).map((product: any) => [
      product.name || 'N/A',
      product.category?.name || 'Sin categoría',
      `$${(product.price || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      (product.totalSold || 0).toString()
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Producto', 'Categoría', 'Precio', 'Vendidos']],
      body: topProductsData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

// Funciones auxiliares para generar hojas Excel específicas por tipo de reporte

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addSalesSummaryExcelSheets(workbook: any, data: any) {
  // Hoja de resumen
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Ingresos', data.summary.totalRevenue || 0],
      ['Total de Órdenes', data.summary.totalOrders || 0],
      ['Valor Promedio por Orden', data.summary.averageOrderValue || 0],
      ['Tasa de Conversión', `${data.summary.conversionRate || 0}%`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }
  
  // Hoja de top productos
  if (data.topProducts && data.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Vendidos', 'Ingresos'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.topProducts.map((product: any) => [
        product.name || 'N/A',
        product.category?.name || 'Sin categoría',
        product.price || 0,
        product.totalSold || 0,
        product.revenue || 0
      ])
    ];
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }
    // Hoja de top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    const topCustomersData = [
      ['Cliente', 'Email', 'Total Gastado', 'Órdenes'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.topCustomers.map((customer: any) => [
        customer.name || 'N/A',
        customer.email || 'N/A',
        customer.totalSpent || 0,
        customer.orderCount || 0
      ])
    ];
    const topCustomersSheet = XLSX.utils.aoa_to_sheet(topCustomersData);
    XLSX.utils.book_append_sheet(workbook, topCustomersSheet, 'Top Clientes');
  }
    // Hoja de ventas por categoría
  if (data.salesTrends?.byCategory && data.salesTrends.byCategory.length > 0) {
    const categoryData = [
      ['Categoría', 'Ingresos', 'Unidades Vendidas'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.salesTrends.byCategory.map((category: any) => [
        category.name || 'N/A',
        category.revenue || 0,
        category.sales || 0
      ])
    ];
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Ventas por Categoría');
  }
    // Hoja de estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    const statusData = [

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ['Estado', 'Cantidad', 'Ingresos'],      ...data.orderStatus.map((status: any) => [
        getStatusText(status.status as OrderStatus) || 'N/A',
        status.count || 0,
        status.revenue || 0
      ])
    ];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Estado Órdenes');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addCustomerAnalysisExcelSheets(workbook: any, data: any) {
  // Hoja de resumen de clientes
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Clientes', data.summary.totalCustomers || 0],
      ['Nuevos Clientes', data.summary.newCustomers || 0],
      ['Tasa de Repetición', `${data.summary.repeatCustomerRate?.toFixed(2) || 0}%`],
      ['Valor Promedio de Vida', data.summary.averageLifetimeValue || 0]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }
  
  // Hoja de top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    const topCustomersData = [
      ['#', 'Cliente', 'Email', 'Total Gastado', 'Órdenes'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.topCustomers.map((customer: any, index: number) => [
        index + 1,
        customer.name || 'N/A',
        customer.email || 'N/A',
        customer.totalSpent || 0,
        customer.orderCount || 0
      ])
    ];
    const topCustomersSheet = XLSX.utils.aoa_to_sheet(topCustomersData);
    XLSX.utils.book_append_sheet(workbook, topCustomersSheet, 'Principales Clientes');
  }
  
  // Hoja de segmentación
  if (data.segmentation) {
    const segmentationData = [
      ['Segmento', 'Cantidad de Clientes'],
      ['Alto Valor (+$1000)', data.segmentation.highValue || 0],
      ['Valor Medio ($500-$1000)', data.segmentation.mediumValue || 0],
      ['Valor Bajo (-$500)', data.segmentation.lowValue || 0]
    ];
    const segmentationSheet = XLSX.utils.aoa_to_sheet(segmentationData);
    XLSX.utils.book_append_sheet(workbook, segmentationSheet, 'Segmentación');
  }
  
  // Hoja de distribución geográfica
  if (data.customersByRegion && data.customersByRegion.length > 0) {
    const geographicData = [
      ['Región', 'Cantidad de Clientes'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.customersByRegion.map((region: any) => [
        region.region || 'Sin especificar',
        region.customerCount || 0
      ])
    ];
    const geographicSheet = XLSX.utils.aoa_to_sheet(geographicData);
    XLSX.utils.book_append_sheet(workbook, geographicSheet, 'Distribución Geográfica');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addProductPerformanceExcelSheets(workbook: any, data: any) {
  // Hoja de resumen de productos
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Productos', data.summary.totalProducts || 0],
      ['Productos Activos', data.summary.activeProducts || 0],
      ['Ingresos Totales', data.summary.totalRevenue || 0],
      ['Unidades Vendidas', data.summary.totalUnitsSold || 0]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }
    // Hoja de top productos
  if (data.topProducts && data.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Vendidos', 'Ingresos'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.topProducts.map((product: any) => [
        product.name || 'N/A',
        product.category?.name || 'Sin categoría',
        product.price || 0,
        product.totalSold || 0,
        product.revenue || 0
      ])
    ];
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }
  
  // Hoja de análisis por categoría
  if (data.categoryAnalysis && data.categoryAnalysis.length > 0) {
    const categoryData = [
      ['Categoría', 'Productos', 'Ingresos', 'Ventas'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.categoryAnalysis.map((category: any) => [
        category.name || 'N/A',
        category.productCount || 0,
        category.revenue || 0,
        category.quantity || 0,
      ])
    ];
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Análisis por Categoría');
  }
  
  // Hoja de insights de inventario
  if (data.inventoryInsights) {
    const inventoryData = [
      ['Métrica', 'Valor'],
      ['Productos con Stock Bajo', data.inventoryInsights.lowStock || 0],
      ['Productos Sin Stock', data.inventoryInsights.outOfStock || 0],
      ['Valor Total de Inventario', data.inventoryInsights.totalInventoryValue || 0],
      ['Rotación de Inventario', `${data.inventoryInsights.turnoverRate || 0}x`]
    ];
    const inventorySheet = XLSX.utils.aoa_to_sheet(inventoryData);
    XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Insights Inventario');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addFinancialReportExcelSheets(workbook: any, data: any) {
  // Hoja de resumen ejecutivo
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Ingresos Totales', data.summary.totalRevenue || 0],
      ['Total de Órdenes', data.summary.totalOrders || 0],
      ['Ticket Promedio', data.summary.averageOrderValue || 0],
      ['Crecimiento', `${data.summary.salesGrowth || 0}%`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen Ejecutivo');
  }
  
  // Hoja de ventas por categoría
  if (data.salesByCategory && data.salesByCategory.length > 0) {
    const categoryData = [
      ['Categoría', 'Ventas Totales', 'Unidades', 'Órdenes'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.salesByCategory.map((category: any) => [
        category.category || 'N/A',
        category.totalSales || 0,
        category.totalQuantity || 0,
        category.orderCount || 0
      ])
    ];
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Ventas por Categoría');
  }
  
  // Hoja de top productos vendidos
  if (data.topProducts && data.topProducts.length > 0) {
    const productData = [
      ['#', 'Producto', 'Categoría', 'Ventas Totales', 'Unidades', 'Precio Promedio'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.topProducts.map((product: any, index: number) => [
        index + 1,
        product.name || 'N/A',
        product.category || 'Sin categoría',
        product.totalSales || 0,
        product.totalQuantity || 0,
        product.averagePrice || 0
      ])
    ];
    const productSheet = XLSX.utils.aoa_to_sheet(productData);
    XLSX.utils.book_append_sheet(workbook, productSheet, 'Top Productos');
  }
  
  // Hoja de ventas diarias
  if (data.dailySales && data.dailySales.length > 0) {
    const dailyData = [
      ['Fecha', 'Ventas Totales', 'Órdenes', 'Ticket Promedio'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.dailySales.slice(0, 10).map((day: any) => [
        day.date || 'N/A',
        day.totalSales || 0,
        day.orderCount || 0,
        day.orderCount > 0 ? (day.totalSales / day.orderCount) : 0
      ])
    ];
    const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Ventas Diarias');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addOrdersAnalysisExcelSheets(workbook: any, data: any) {  // Hoja de distribución por estado
  if (data.statusBreakdown && data.statusBreakdown.length > 0) {
    const statusData = [
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ['Estado', 'Cantidad', 'Ingresos'],      ...data.statusBreakdown.map((status: any) => [
        getStatusText(status.status as OrderStatus) || 'N/A',
        status.count || 0,
        status.revenue || 0
      ])
    ];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Estado Órdenes');
  }
  
  // Hoja de tendencias diarias
  if (data.dailyTrends && data.dailyTrends.length > 0) {
    const trendsData = [
      ['Fecha', 'Órdenes', 'Ingresos'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.dailyTrends.slice(0, 30).map((day: any) => [
        day.date || 'N/A',
        day.orders || 0,
        day.revenue || 0
      ])
    ];
    const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendencias Diarias');
  }
  
  // Hoja de métricas de procesamiento
  if (data.processingMetrics) {
    const metricsData = [
      ['Métrica', 'Valor'],
      ['Tiempo Promedio de Procesamiento', `${data.processingMetrics.averageProcessingHours || 0} horas`],
      ['Tiempo Promedio de Envío', `${data.processingMetrics.averageShippingHours || 0} horas`],
      ['Días Promedio de Entrega', `${data.processingMetrics.averageDeliveryDays || 0} días`]
    ];
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métricas de Procesamiento');
  }
  
  // Hoja de distribución por tamaño de orden
  if (data.orderSizeDistribution && data.orderSizeDistribution.length > 0) {
    const sizeData = [
      ['Rango de Tamaño', 'Cantidad de Órdenes'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.orderSizeDistribution.map((size: any) => [
        size.range || 'N/A',
        size.count || 0
      ])
    ];
    const sizeSheet = XLSX.utils.aoa_to_sheet(sizeData);
    XLSX.utils.book_append_sheet(workbook, sizeSheet, 'Distribución por Tamaño');
  }
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addGeneralExcelSheets(workbook: any, data: any) {
  // Hoja de resumen general
  const statsToShow = data.quickStats || data.summary || {};
  if (Object.keys(statsToShow).length > 0) {
    const overviewData = [
      ['Métrica', 'Valor'],
      ['Total de Ingresos', statsToShow.totalRevenue || 0],
      ['Total de Órdenes', statsToShow.totalOrders || 0],
      ['Total de Usuarios', statsToShow.totalUsers || statsToShow.totalCustomers || 0],
      ['Total de Productos', statsToShow.totalProducts || 0]
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Resumen');
  }
  
  // Hoja de productos más vendidos
  if (data.topProducts && data.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Total Vendidos'],
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
      ...data.topProducts.map((product: any) => [
        product.name || 'N/A',
        product.category?.name || 'Sin categoría',
        product.price || 0,
        product.totalSold || 0
      ])
    ];
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }
  
  // Hoja de estadísticas mensuales si existe
  if (data.monthlyStats && data.monthlyStats.length > 0) {
    const monthlyData = [
      ['Mes', 'Órdenes', 'Ingresos'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...data.monthlyStats.map((stat: any) => [
        stat.month || 'N/A',
        stat.orders || 0,
        stat.revenue || 0
      ])
    ];
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Estadísticas Mensuales');
  }
}

// Funciones auxiliares para generar contenido CSV específico por tipo de reporte

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateSalesSummaryCSV(data: any): string {
  let content = '';
  
  // Resumen ejecutivo
  if (data.summary) {
    content += 'RESUMEN EJECUTIVO\n';
    content += 'Métrica,Valor\n';
    // Usar los mismos campos que en Excel
    content += `Total de Ingresos,${data.summary.totalRevenue || 0}\n`;
    content += `Total de Órdenes,${data.summary.totalOrders || 0}\n`;
    content += `Valor Promedio por Orden,${data.summary.averageOrderValue || 0}\n`;
    content += `Tasa de Conversión,${data.summary.conversionRate || 0}%\n\n`;
  }
  
  // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    content += 'PRODUCTOS MÁS VENDIDOS\n';
    content += 'Producto,Categoría,Precio,Vendidos,Ingresos\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0},${product.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    content += 'MEJORES CLIENTES\n';
    content += 'Cliente,Email,Total Gastado,Órdenes\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any   
    data.topCustomers.forEach((customer: any) => {
      content += `"${customer.name || 'N/A'}","${customer.email || 'N/A'}",${customer.totalSpent || 0},${customer.orderCount || 0}\n`;
    });
    content += '\n';
  }
  
  // Ventas por categoría
  if (data.salesTrends?.byCategory && data.salesTrends.byCategory.length > 0) {
    content += 'VENTAS POR CATEGORÍA\n';
    content += 'Categoría,Ingresos,Unidades Vendidas\n';

// eslint-disable-next-line @typescript-eslint/no-explicit-any   
    data.salesTrends.byCategory.forEach((category: any) => {
      content += `"${category.name || 'N/A'}",${category.revenue || 0},${category.sales || 0}\n`;
    });
    content += '\n';
  }
    // Estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    content += 'ESTADO DE ÓRDENES\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    content += 'Estado,Cantidad,Ingresos\n';    data.orderStatus.forEach((status: any) => {
      content += `${getStatusText(status.status as OrderStatus) || 'N/A'},${status.count || 0},${status.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCustomerAnalysisCSV(data: any): string {
  let content = '';
  
  // Resumen de clientes
  if (data.summary) {
    content += 'RESUMEN DE CLIENTES\n';
    content += 'Métrica,Valor\n';    content += `Total de Clientes,${data.summary.totalCustomers || 0}\n`;
    content += `Nuevos Clientes,${data.summary.newCustomers || 0}\n`;
    content += `Tasa de Repetición,${data.summary.repeatCustomerRate?.toFixed(2) || 0}%\n`;
    content += `Valor Promedio de Vida,${data.summary.averageLifetimeValue || 0}\n\n`;
  }
  
  // Principales clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    content += 'PRINCIPALES CLIENTES\n';
    content += '#,Cliente,Email,Total Gastado,Órdenes\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.topCustomers.forEach((customer: any, index: number) => {
      content += `${index + 1},"${customer.name || 'N/A'}","${customer.email || 'N/A'}",${customer.totalSpent || 0},${customer.orderCount || 0}\n`;
    });
    content += '\n';
  }
  
  // Segmentación de clientes
  if (data.segmentation) {
    content += 'SEGMENTACIÓN DE CLIENTES\n';
    content += 'Segmento,Cantidad de Clientes\n';
    content += `Alto Valor (+$1000),${data.segmentation.highValue || 0}\n`;
    content += `Valor Medio ($500-$1000),${data.segmentation.mediumValue || 0}\n`;
    content += `Valor Bajo (-$500),${data.segmentation.lowValue || 0}\n\n`;
  }
  
  // Distribución geográfica
  if (data.customersByRegion && data.customersByRegion.length > 0) {
    content += 'DISTRIBUCIÓN GEOGRÁFICA\n';
    content += 'Región,Cantidad de Clientes\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.customersByRegion.forEach((region: any) => {
      content += `"${region.region || 'Sin especificar'}",${region.customerCount || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateProductPerformanceCSV(data: any): string {
  let content = '';
    // Resumen de productos
  if (data.summary) {
    content += 'RESUMEN DE PRODUCTOS\n';
    content += 'Métrica,Valor\n';
    content += `Total de Productos,${data.summary.totalProducts || 0}\n`;
    content += `Productos Activos,${data.summary.activeProducts || 0}\n`;
    content += `Ingresos Totales,${data.summary.totalRevenue || 0}\n`;
    content += `Unidades Vendidas,${data.summary.totalUnitsSold || 0}\n\n`;
  }
  
  // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    content += 'PRODUCTOS MÁS VENDIDOS\n';
    content += 'Producto,Categoría,Precio,Vendidos,Ingresos\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0},${product.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Análisis por categoría
  if (data.categoryAnalysis && data.categoryAnalysis.length > 0) {
    content += 'ANÁLISIS POR CATEGORÍA\n';
    content += 'Categoría,Productos,Ingresos,Ventas,Participación\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.categoryAnalysis.forEach((category: any) => {
      content += `"${category.name || 'N/A'}",${category.products || 0},${category.revenue || 0},${category.sales || 0},${category.percentage || 0}%\n`;
    });
    content += '\n';
  }
    // Insights de inventario
  if (data.inventoryInsights) {
    content += 'INSIGHTS DE INVENTARIO\n';
    content += 'Métrica,Valor\n';
    content += `Productos con Stock Bajo,${data.inventoryInsights.lowStock || 0}\n`;
    content += `Productos Sin Stock,${data.inventoryInsights.outOfStock || 0}\n`;
    content += `Valor Total de Inventario,${data.inventoryInsights.totalInventoryValue || 0}\n`;
    content += `Rotación de Inventario,${data.inventoryInsights.turnoverRate || 0}x\n\n`;
  }
  
  return content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateFinancialReportCSV(data: any): string {
  let content = '';
  
  // Resumen Ejecutivo
  if (data.summary) {
    content += 'RESUMEN EJECUTIVO\n';
    content += 'Métrica,Valor\n';
    content += `Ingresos Totales,${data.summary.totalRevenue || 0}\n`;
    content += `Total de Órdenes,${data.summary.totalOrders || 0}\n`;
    content += `Ticket Promedio,${data.summary.averageOrderValue || 0}\n`;
    content += `Crecimiento,${data.summary.salesGrowth || 0}%\n\n`;
  }
  
  // Ventas por Categoría
  if (data.salesByCategory && data.salesByCategory.length > 0) {
    content += 'VENTAS POR CATEGORÍA\n';
    content += 'Categoría,Ventas Totales,Unidades,Órdenes\n';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.salesByCategory.forEach((category: any) => {
      content += `"${category.category || 'N/A'}",${category.totalSales || 0},${category.totalQuantity || 0},${category.orderCount || 0}\n`;
    });
    content += '\n';
  }
  
  // Top Productos Vendidos
  if (data.topProducts && data.topProducts.length > 0) {
    content += 'PRODUCTOS MÁS VENDIDOS\n';
    content += '#,Producto,Categoría,Ventas Totales,Unidades,Precio Promedio\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.topProducts.forEach((product: any, index: number) => {

      content += `${index + 1},"${product.name || 'N/A'}","${product.category || 'Sin categoría'}",${product.totalSales || 0},${product.totalQuantity || 0},${product.averagePrice || 0}\n`;
    });
    content += '\n';
  }
  
  // Ventas Diarias Recientes
  if (data.dailySales && data.dailySales.length > 0) {
    content += 'VENTAS DIARIAS RECIENTES\n';
    content += 'Fecha,Ventas Totales,Órdenes,Ticket Promedio\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.dailySales.slice(0, 10).forEach((day: any) => {
      const avgTicket = day.orderCount > 0 ? (day.totalSales / day.orderCount) : 0;
      content += `"${day.date || 'N/A'}",${day.totalSales || 0},${day.orderCount || 0},${avgTicket}\n`;
    });
    content += '\n';
  }
  
  return content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateOrdersAnalysisCSV(data: any): string {
  let csv = '';
  // Distribución por estado
  if (data.statusBreakdown && data.statusBreakdown.length > 0) {
    csv += 'DISTRIBUCIÓN POR ESTADO\n';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    csv += 'Estado,Cantidad,Ingresos\n';    data.statusBreakdown.forEach((status: any) => {
      csv += `${getStatusText(status.status as OrderStatus) || 'N/A'},${status.count || 0},${status.revenue || 0}\n`;
    });
    csv += '\n';
  }

  // Tendencias diarias (últimos 30 días)
  if (data.dailyTrends && data.dailyTrends.length > 0) {
    csv += 'TENDENCIAS DIARIAS (últimos 30 días)\n';
    csv += 'Fecha,Órdenes,Ingresos\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.dailyTrends.slice(0, 30).forEach((day: any) => {
      csv += `${day.date || 'N/A'},${day.orders || 0},${day.revenue || 0}\n`;
    });
    csv += '\n';
  }

  // Métricas de procesamiento
  if (data.processingMetrics) {
    csv += 'MÉTRICAS DE PROCESAMIENTO\n';
    csv += 'Métrica,Valor\n';
    csv += `Tiempo Promedio de Procesamiento,${data.processingMetrics.averageProcessingHours || 0} horas\n`;
    csv += `Tiempo Promedio de Envío,${data.processingMetrics.averageShippingHours || 0} horas\n`;
    csv += `Días Promedio de Entrega,${data.processingMetrics.averageDeliveryDays || 0} días\n`;
    csv += '\n';
  }

  // Distribución por tamaño de orden
  if (data.orderSizeDistribution && data.orderSizeDistribution.length > 0) {
    csv += 'DISTRIBUCIÓN POR TAMAÑO DE ORDEN\n';
    csv += 'Rango,Cantidad\n';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.orderSizeDistribution.forEach((size: any) => {
      csv += `${size.range || 'N/A'},${size.count || 0}\n`;
    });
    csv += '\n';
  }

  return csv;
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateGeneralCSV(data: any): string {
  let content = '';
  
  // Resumen ejecutivo
  const statsToShow = data.quickStats || data.summary || {};
  if (Object.keys(statsToShow).length > 0) {
    content += 'RESUMEN EJECUTIVO\n';
    content += 'Métrica,Valor\n';
    content += `Total de Ingresos,$${(statsToShow.totalRevenue || 0).toLocaleString('es-ES')}\n`;
    content += `Total de Órdenes,${statsToShow.totalOrders || 0}\n`;
    content += `Total de Usuarios,${statsToShow.totalUsers || statsToShow.totalCustomers || 0}\n`;
    content += `Total de Productos,${statsToShow.totalProducts || 0}\n\n`;
  }
  
  // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    content += 'PRODUCTOS MÁS VENDIDOS\n';
    content += 'Producto,Categoría,Precio,Total Vendidos\n';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0}\n`;
    });
    content += '\n';
  }
  
  // Estadísticas mensuales
  if (data.monthlyStats && data.monthlyStats.length > 0) {
    content += 'ESTADÍSTICAS MENSUALES\n';
    content += 'Mes,Órdenes,Ingresos\n';

// eslint-disable-next-line @typescript-eslint/no-explicit-any   
    data.monthlyStats.forEach((stat: any) => {
      content += `${stat.month || 'N/A'},${stat.orders || 0},${stat.revenue || 0}\n`;
    });
    content += '\n';
  }
    // Estado de órdenes
  if (data.orderStatusData && data.orderStatusData.length > 0) {
    content += 'ESTADO DE ÓRDENES\n';
    content += 'Estado,Cantidad\n';  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.orderStatusData.forEach((status: any) => {
      content += `${getStatusText(status.status as OrderStatus) || 'N/A'},${status.count || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}
