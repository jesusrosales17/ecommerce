import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
  summary?: any;
  salesTrends?: any;
  topCustomers?: any;
  categoryAnalysis?: any;
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
    styles: { fontSize: 10 }
  });
  
  currentY = (doc as any).lastAutoTable.finalY + 15;
  
  // Productos más vendidos
  if (data.topProducts.length > 0) {
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
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
      styles: { fontSize: 9 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Nueva página para órdenes recientes
  if (data.recentOrders.length > 0) {
    doc.addPage();
    currentY = 20;
    
    doc.setFontSize(16);
    doc.text('Órdenes Recientes', 14, currentY);
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

export const exportToExcel = async (data: ExportData, dateRange: string, reportId?: string) => {
  // Si tenemos reportId, obtener los datos completos del mismo endpoint que usa la vista previa
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
    ['Total Usuarios', data.overview.totalUsers],
    ['Total Productos', data.overview.totalProducts],
    ['Total Categorías', data.overview.totalCategories],
    ['Total Órdenes', data.overview.totalOrders],
    ['Órdenes Pendientes', data.overview.pendingOrders],
    ['Ingresos Totales', data.overview.totalRevenue],
    ['Crecimiento de Usuarios (%)', data.overview.userGrowthPercentage]
  ];
  
  const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Resumen');
  
  // Hoja de productos más vendidos
  if (data.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Total Vendidos'],
      ...data.topProducts.map(product => [
        product.name,
        product.category.name,
        product.price,
        product.totalSold
      ])
    ];
    
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }
  
  // Hoja de órdenes recientes
  if (data.recentOrders.length > 0) {    const ordersData = [
      ['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha'],
      ...data.recentOrders.map(order => [
        order.id,
        order.customerName,
        order.customerEmail,
        order.total,
        order.status,
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
        break;
    }
  } else {
    // Fallback para reportes sin tipo específico
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
    
    const orderStatusData = data.orderStatus.map((status: any) => [
      status.status || 'N/A',
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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Top productos
  if (data.topPerformers && data.topPerformers.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    const topProductsData = data.topPerformers.slice(0, 10).map((product: any, index: number) => [
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
    
    const categoryData = data.categoryAnalysis.map((category: any) => [
      category.name || 'N/A',
      category.productCount?.toString() || '0',
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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

async function addFinancialReportContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen financiero
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen Financiero', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Ingresos Totales', `$${data.summary.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Gastos Totales', `$${data.summary.totalExpenses?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Ganancia Neta', `$${data.summary.netProfit?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Margen de Ganancia', `${data.summary.profitMargin || 0}%`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Análisis de ingresos
  if (data.revenueAnalysis) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Análisis de Ingresos', 14, currentY);
    currentY += 10;
    
    const revenueData = [
      ['Ingresos por Ventas', `$${data.revenueAnalysis.salesRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Ingresos por Envío', `$${data.revenueAnalysis.shippingRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Impuestos Recaudados', `$${data.revenueAnalysis.taxesCollected?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Descuentos Aplicados', `$${data.revenueAnalysis.discountsApplied?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Monto']],
      body: revenueData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Análisis de gastos
  if (data.expenseAnalysis && data.expenseAnalysis.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Análisis de Gastos', 14, currentY);
    currentY += 5;
    
    const expenseData = data.expenseAnalysis.map((expense: any) => [
      expense.category || 'N/A',
      `$${expense.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`,
      `${expense.percentage || 0}%`,
      expense.trend === 'up' ? '↗' : expense.trend === 'down' ? '↘' : '→'
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Categoría', 'Monto', 'Porcentaje', 'Tendencia']],
      body: expenseData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Flujo de caja
  if (data.cashFlow) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Flujo de Caja', 14, currentY);
    currentY += 10;
    
    const cashFlowData = [
      ['Efectivo Inicial', `$${data.cashFlow.startingCash?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Entradas de Efectivo', `$${data.cashFlow.cashInflows?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Salidas de Efectivo', `$${data.cashFlow.cashOutflows?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`],
      ['Efectivo Final', `$${data.cashFlow.endingCash?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Concepto', 'Monto']],
      body: cashFlowData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

async function addOrdersAnalysisContent(doc: any, data: any, startY: number): Promise<number> {
  let currentY = startY;
  
  // Resumen de órdenes
  if (data.summary) {
    doc.setFontSize(16);
    doc.text('Resumen de Órdenes', 14, currentY);
    currentY += 10;
    
    const summaryData = [
      ['Total de Órdenes', data.summary.totalOrders?.toString() || '0'],
      ['Órdenes Completadas', data.summary.completedOrders?.toString() || '0'],
      ['Órdenes Pendientes', data.summary.pendingOrders?.toString() || '0'],
      ['Tasa de Completación', `${data.summary.completionRate || 0}%`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Distribución por Estado', 14, currentY);
    currentY += 5;
    
    const statusData = data.orderStatus.map((status: any) => [
      status.status || 'N/A',
      status.count?.toString() || '0',
      `${status.percentage || 0}%`,
      `$${status.revenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Estado', 'Cantidad', 'Porcentaje', 'Ingresos']],
      body: statusData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Tendencias de tiempo
  if (data.timeAnalysis) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Análisis Temporal', 14, currentY);
    currentY += 10;
    
    const timeData = [
      ['Tiempo Promedio de Procesamiento', `${data.timeAnalysis.avgProcessingTime || 0} horas`],
      ['Tiempo Promedio de Envío', `${data.timeAnalysis.avgShippingTime || 0} días`],
      ['Tiempo Total Promedio', `${data.timeAnalysis.avgTotalTime || 0} días`],
      ['SLA Cumplido', `${data.timeAnalysis.slaCompliance || 0}%`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: timeData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Análisis por método de pago
  if (data.paymentMethods && data.paymentMethods.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Métodos de Pago', 14, currentY);
    currentY += 5;
    
    const paymentData = data.paymentMethods.map((method: any) => [
      method.method || 'N/A',
      method.orders?.toString() || '0',
      `${method.percentage || 0}%`,
      `$${method.revenue?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}`
    ]);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Método', 'Órdenes', 'Porcentaje', 'Ingresos']],
      body: paymentData,
      theme: 'striped',
      styles: { fontSize: 9 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}



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
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  return currentY;
}

// Funciones auxiliares para generar hojas Excel específicas por tipo de reporte

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
      ['Estado', 'Cantidad', 'Ingresos'],
      ...data.orderStatus.map((status: any) => [
        status.status || 'N/A',
        status.count || 0,
        status.revenue || 0
      ])
    ];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Estado Órdenes');
  }
}

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
      ...data.customersByRegion.map((region: any) => [
        region.region || 'Sin especificar',
        region.customerCount || 0
      ])
    ];
    const geographicSheet = XLSX.utils.aoa_to_sheet(geographicData);
    XLSX.utils.book_append_sheet(workbook, geographicSheet, 'Distribución Geográfica');
  }
}

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
      ['Categoría', 'Productos', 'Ingresos', 'Ventas', 'Participación'],
      ...data.categoryAnalysis.map((category: any) => [
        category.name || 'N/A',
        category.products || 0,
        category.revenue || 0,
        category.sales || 0,
        `${category.percentage || 0}%`
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

function addFinancialReportExcelSheets(workbook: any, data: any) {
  // Hoja de resumen financiero
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Ingresos Totales', data.summary.totalRevenue || 0],
      ['Gastos Totales', data.summary.totalExpenses || 0],
      ['Ganancia Neta', data.summary.netProfit || 0],
      ['Margen de Ganancia', `${data.summary.profitMargin || 0}%`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen Financiero');
  }
  
  // Hoja de análisis de ingresos
  if (data.revenueAnalysis) {
    const revenueData = [
      ['Concepto', 'Monto'],
      ['Ingresos por Ventas', data.revenueAnalysis.salesRevenue || 0],
      ['Ingresos por Envío', data.revenueAnalysis.shippingRevenue || 0],
      ['Impuestos Recaudados', data.revenueAnalysis.taxesCollected || 0],
      ['Descuentos Aplicados', data.revenueAnalysis.discountsApplied || 0]
    ];
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Análisis de Ingresos');
  }
  
  // Hoja de análisis de gastos
  if (data.expenseAnalysis && data.expenseAnalysis.length > 0) {
    const expenseData = [
      ['Categoría', 'Monto', 'Porcentaje', 'Tendencia'],
      ...data.expenseAnalysis.map((expense: any) => [
        expense.category || 'N/A',
        expense.amount || 0,
        `${expense.percentage || 0}%`,
        expense.trend === 'up' ? 'Subida' : expense.trend === 'down' ? 'Bajada' : 'Estable'
      ])
    ];
    const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Análisis de Gastos');
  }
  
  // Hoja de flujo de caja
  if (data.cashFlow) {
    const cashFlowData = [
      ['Concepto', 'Monto'],
      ['Efectivo Inicial', data.cashFlow.startingCash || 0],
      ['Entradas de Efectivo', data.cashFlow.cashInflows || 0],
      ['Salidas de Efectivo', data.cashFlow.cashOutflows || 0],
      ['Efectivo Final', data.cashFlow.endingCash || 0]
    ];
    const cashFlowSheet = XLSX.utils.aoa_to_sheet(cashFlowData);
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Flujo de Caja');
  }
}

function addOrdersAnalysisExcelSheets(workbook: any, data: any) {
  // Hoja de resumen de órdenes
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Órdenes', data.summary.totalOrders || 0],
      ['Órdenes Completadas', data.summary.completedOrders || 0],
      ['Órdenes Pendientes', data.summary.pendingOrders || 0],
      ['Tasa de Completación', `${data.summary.completionRate || 0}%`]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }
  
  // Hoja de estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    const statusData = [
      ['Estado', 'Cantidad', 'Porcentaje', 'Ingresos'],
      ...data.orderStatus.map((status: any) => [
        status.status || 'N/A',
        status.count || 0,
        `${status.percentage || 0}%`,
        status.revenue || 0
      ])
    ];
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Estado Órdenes');
  }
  
  // Hoja de análisis temporal
  if (data.timeAnalysis) {
    const timeData = [
      ['Métrica', 'Valor'],
      ['Tiempo Promedio de Procesamiento', `${data.timeAnalysis.avgProcessingTime || 0} horas`],
      ['Tiempo Promedio de Envío', `${data.timeAnalysis.avgShippingTime || 0} días`],
      ['Tiempo Total Promedio', `${data.timeAnalysis.avgTotalTime || 0} días`],
      ['SLA Cumplido', `${data.timeAnalysis.slaCompliance || 0}%`]
    ];
    const timeSheet = XLSX.utils.aoa_to_sheet(timeData);
    XLSX.utils.book_append_sheet(workbook, timeSheet, 'Análisis Temporal');
  }
  
  // Hoja de métodos de pago
  if (data.paymentMethods && data.paymentMethods.length > 0) {
    const paymentData = [
      ['Método', 'Órdenes', 'Porcentaje', 'Ingresos'],
      ...data.paymentMethods.map((method: any) => [
        method.method || 'N/A',
        method.orders || 0,
        `${method.percentage || 0}%`,
        method.revenue || 0
      ])
    ];
    const paymentSheet = XLSX.utils.aoa_to_sheet(paymentData);
    XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Métodos de Pago');
  }
}



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
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0},${product.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Top clientes
  if (data.topCustomers && data.topCustomers.length > 0) {
    content += 'MEJORES CLIENTES\n';
    content += 'Cliente,Email,Total Gastado,Órdenes\n';
    data.topCustomers.forEach((customer: any) => {
      content += `"${customer.name || 'N/A'}","${customer.email || 'N/A'}",${customer.totalSpent || 0},${customer.orderCount || 0}\n`;
    });
    content += '\n';
  }
  
  // Ventas por categoría
  if (data.salesTrends?.byCategory && data.salesTrends.byCategory.length > 0) {
    content += 'VENTAS POR CATEGORÍA\n';
    content += 'Categoría,Ingresos,Unidades Vendidas\n';
    data.salesTrends.byCategory.forEach((category: any) => {
      content += `"${category.name || 'N/A'}",${category.revenue || 0},${category.sales || 0}\n`;
    });
    content += '\n';
  }
  
  // Estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    content += 'ESTADO DE ÓRDENES\n';
    content += 'Estado,Cantidad,Ingresos\n';
    data.orderStatus.forEach((status: any) => {
      content += `${status.status || 'N/A'},${status.count || 0},${status.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}

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
    data.customersByRegion.forEach((region: any) => {
      content += `"${region.region || 'Sin especificar'}",${region.customerCount || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}

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
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0},${product.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Análisis por categoría
  if (data.categoryAnalysis && data.categoryAnalysis.length > 0) {
    content += 'ANÁLISIS POR CATEGORÍA\n';
    content += 'Categoría,Productos,Ingresos,Ventas,Participación\n';
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

function generateFinancialReportCSV(data: any): string {
  let content = '';
  
  // Resumen financiero
  if (data.summary) {
    content += 'RESUMEN FINANCIERO\n';
    content += 'Métrica,Valor\n';
    content += `Ingresos Totales,${data.summary.totalRevenue || 0}\n`;
    content += `Gastos Totales,${data.summary.totalExpenses || 0}\n`;
    content += `Ganancia Neta,${data.summary.netProfit || 0}\n`;
    content += `Margen de Ganancia,${data.summary.profitMargin || 0}%\n\n`;
  }
    // Análisis de ingresos
  if (data.revenueAnalysis) {
    content += 'ANÁLISIS DE INGRESOS\n';
    content += 'Concepto,Monto\n';
    content += `Ingresos por Ventas,${data.revenueAnalysis.salesRevenue || 0}\n`;
    content += `Ingresos por Envío,${data.revenueAnalysis.shippingRevenue || 0}\n`;
    content += `Impuestos Recaudados,${data.revenueAnalysis.taxesCollected || 0}\n`;
    content += `Descuentos Aplicados,${data.revenueAnalysis.discountsApplied || 0}\n\n`;
  }
  
  // Análisis de gastos
  if (data.expenseAnalysis && data.expenseAnalysis.length > 0) {
    content += 'ANÁLISIS DE GASTOS\n';
    content += 'Categoría,Monto,Porcentaje,Tendencia\n';
    data.expenseAnalysis.forEach((expense: any) => {
      const trendText = expense.trend === 'up' ? 'Subida' : expense.trend === 'down' ? 'Bajada' : 'Estable';
      content += `"${expense.category || 'N/A'}",${expense.amount || 0},${expense.percentage || 0}%,${trendText}\n`;
    });
    content += '\n';
  }
    // Flujo de caja
  if (data.cashFlow) {
    content += 'FLUJO DE CAJA\n';
    content += 'Concepto,Monto\n';
    content += `Efectivo Inicial,${data.cashFlow.startingCash || 0}\n`;
    content += `Entradas de Efectivo,${data.cashFlow.cashInflows || 0}\n`;
    content += `Salidas de Efectivo,${data.cashFlow.cashOutflows || 0}\n`;
    content += `Efectivo Final,${data.cashFlow.endingCash || 0}\n\n`;
  }
  
  return content;
}

function generateOrdersAnalysisCSV(data: any): string {
  let content = '';
  
  // Resumen de órdenes
  if (data.summary) {
    content += 'RESUMEN DE ÓRDENES\n';
    content += 'Métrica,Valor\n';
    content += `Total de Órdenes,${data.summary.totalOrders || 0}\n`;
    content += `Órdenes Completadas,${data.summary.completedOrders || 0}\n`;
    content += `Órdenes Pendientes,${data.summary.pendingOrders || 0}\n`;
    content += `Tasa de Completación,${data.summary.completionRate || 0}%\n\n`;
  }
  
  // Estado de órdenes
  if (data.orderStatus && data.orderStatus.length > 0) {
    content += 'DISTRIBUCIÓN POR ESTADO\n';
    content += 'Estado,Cantidad,Porcentaje,Ingresos\n';
    data.orderStatus.forEach((status: any) => {
      content += `${status.status || 'N/A'},${status.count || 0},${status.percentage || 0}%,${status.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Análisis temporal
  if (data.timeAnalysis) {
    content += 'ANÁLISIS TEMPORAL\n';
    content += 'Métrica,Valor\n';
    content += `Tiempo Promedio de Procesamiento,${data.timeAnalysis.avgProcessingTime || 0} horas\n`;
    content += `Tiempo Promedio de Envío,${data.timeAnalysis.avgShippingTime || 0} días\n`;
    content += `Tiempo Total Promedio,${data.timeAnalysis.avgTotalTime || 0} días\n`;
    content += `SLA Cumplido,${data.timeAnalysis.slaCompliance || 0}%\n\n`;
  }
  
  // Métodos de pago
  if (data.paymentMethods && data.paymentMethods.length > 0) {
    content += 'MÉTODOS DE PAGO\n';
    content += 'Método,Órdenes,Porcentaje,Ingresos\n';
    data.paymentMethods.forEach((method: any) => {
      content += `"${method.method || 'N/A'}",${method.orders || 0},${method.percentage || 0}%,${method.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}



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
    data.topProducts.forEach((product: any) => {
      content += `"${product.name || 'N/A'}","${product.category?.name || 'Sin categoría'}",${product.price || 0},${product.totalSold || 0}\n`;
    });
    content += '\n';
  }
  
  // Estadísticas mensuales
  if (data.monthlyStats && data.monthlyStats.length > 0) {
    content += 'ESTADÍSTICAS MENSUALES\n';
    content += 'Mes,Órdenes,Ingresos\n';
    data.monthlyStats.forEach((stat: any) => {
      content += `${stat.month || 'N/A'},${stat.orders || 0},${stat.revenue || 0}\n`;
    });
    content += '\n';
  }
  
  // Estado de órdenes
  if (data.orderStatusData && data.orderStatusData.length > 0) {
    content += 'ESTADO DE ÓRDENES\n';
    content += 'Estado,Cantidad\n';
    data.orderStatusData.forEach((status: any) => {
      content += `${status.status || 'N/A'},${status.count || 0}\n`;
    });
    content += '\n';
  }
  
  return content;
}
