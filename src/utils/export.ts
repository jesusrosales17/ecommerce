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

export const exportToExcel = (data: ExportData) => {
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
  
  // Resumen rápido si existe
  if (data.quickStats) {
    doc.setFontSize(16);
    doc.text('Resumen Ejecutivo', 14, currentY);
    currentY += 10;
    
    const quickStatsData = [
      ['Total de Ingresos', `$${data.quickStats.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, data.quickStats.revenueChange],
      ['Total de Órdenes', data.quickStats.totalOrders.toString(), data.quickStats.ordersChange],
      ['Total de Usuarios', data.quickStats.totalUsers.toString(), data.quickStats.usersChange],
      ['Total de Productos', data.quickStats.totalProducts.toString(), data.quickStats.productsChange]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor', 'Cambio']],
      body: quickStatsData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Top productos si existen
  if (data.topProducts && data.topProducts.length > 0) {
    doc.setFontSize(16);
    doc.text('Productos Más Vendidos', 14, currentY);
    currentY += 5;
    
    const topProductsData = data.topProducts.slice(0, 10).map(product => [
      product.name,
      product.category?.name || 'Sin categoría',
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
  
  // Datos específicos del reporte
  if (data.summary && reportId) {
    doc.addPage();
    currentY = 20;
    
    doc.setFontSize(16);
    doc.text('Análisis Detallado', 14, currentY);
    currentY += 10;
    
    // Agregar contenido específico según el tipo de reporte
    addReportSpecificContent(doc, data, reportId, currentY);
  }
  
  // Convertir a Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};

// Nueva función para generar Excel como Buffer
export const generateExcelReport = async (data: ReportData, dateRange: string, reportId?: string): Promise<Buffer> => {
  const workbook = XLSX.utils.book_new();
  
  // Hoja de resumen
  if (data.quickStats) {
    const overviewData = [
      ['Métrica', 'Valor', 'Cambio'],
      ['Total de Ingresos', data.quickStats.totalRevenue, data.quickStats.revenueChange],
      ['Total de Órdenes', data.quickStats.totalOrders, data.quickStats.ordersChange],
      ['Total de Usuarios', data.quickStats.totalUsers, data.quickStats.usersChange],
      ['Total de Productos', data.quickStats.totalProducts, data.quickStats.productsChange]
    ];
    
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Resumen');
  }
  
  // Hoja de productos más vendidos
  if (data.topProducts && data.topProducts.length > 0) {
    const topProductsData = [
      ['Producto', 'Categoría', 'Precio', 'Total Vendidos'],
      ...data.topProducts.map(product => [
        product.name,
        product.category?.name || 'Sin categoría',
        product.price,
        product.totalSold
      ])
    ];
    
    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(workbook, topProductsSheet, 'Top Productos');
  }
  
  // Hoja de estadísticas mensuales
  if (data.monthlyStats && data.monthlyStats.length > 0) {
    const monthlyData = [
      ['Mes', 'Órdenes', 'Ingresos'],
      ...data.monthlyStats.map(stat => [
        stat.month,
        stat.orders,
        stat.revenue
      ])
    ];
    
    const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Estadísticas Mensuales');
  }
  
  // Hoja de estado de órdenes
  if (data.orderStatusData && data.orderStatusData.length > 0) {
    const statusData = [
      ['Estado', 'Cantidad'],
      ...data.orderStatusData.map(status => [
        status.status,
        status.count
      ])
    ];
    
    const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
    XLSX.utils.book_append_sheet(workbook, statusSheet, 'Estado Órdenes');
  }
  
  // Agregar hojas específicas según el tipo de reporte
  if (reportId && data.summary) {
    addExcelReportSpecificSheets(workbook, data, reportId);
  }
  
  // Convertir a Buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
};

// Nueva función para generar CSV como Buffer
export const generateCSVReport = async (data: ReportData, dateRange: string, reportId?: string): Promise<Buffer> => {
  let csvContent = '';
  
  // Encabezado
  const title = reportId ? getReportTitle(reportId) : 'Reporte General';
  csvContent += `${title}\n`;
  csvContent += `Período: ${formatDateRangeText(dateRange)}\n`;
  csvContent += `Generado: ${new Date().toLocaleDateString('es-ES')}\n\n`;
  
  // Resumen ejecutivo
  if (data.quickStats) {
    csvContent += 'RESUMEN EJECUTIVO\n';
    csvContent += 'Métrica,Valor,Cambio\n';
    csvContent += `Total de Ingresos,$${data.quickStats.totalRevenue.toLocaleString('es-ES')},${data.quickStats.revenueChange}\n`;
    csvContent += `Total de Órdenes,${data.quickStats.totalOrders},${data.quickStats.ordersChange}\n`;
    csvContent += `Total de Usuarios,${data.quickStats.totalUsers},${data.quickStats.usersChange}\n`;
    csvContent += `Total de Productos,${data.quickStats.totalProducts},${data.quickStats.productsChange}\n\n`;
  }
  
  // Top productos
  if (data.topProducts && data.topProducts.length > 0) {
    csvContent += 'PRODUCTOS MÁS VENDIDOS\n';
    csvContent += 'Producto,Categoría,Precio,Total Vendidos\n';
    data.topProducts.forEach(product => {
      csvContent += `"${product.name}","${product.category?.name || 'Sin categoría'}",${product.price},${product.totalSold}\n`;
    });
    csvContent += '\n';
  }
  
  // Estadísticas mensuales
  if (data.monthlyStats && data.monthlyStats.length > 0) {
    csvContent += 'ESTADÍSTICAS MENSUALES\n';
    csvContent += 'Mes,Órdenes,Ingresos\n';
    data.monthlyStats.forEach(stat => {
      csvContent += `${stat.month},${stat.orders},${stat.revenue}\n`;
    });
    csvContent += '\n';
  }
  
  // Estado de órdenes
  if (data.orderStatusData && data.orderStatusData.length > 0) {
    csvContent += 'ESTADO DE ÓRDENES\n';
    csvContent += 'Estado,Cantidad\n';
    data.orderStatusData.forEach(status => {
      csvContent += `${status.status},${status.count}\n`;
    });
    csvContent += '\n';
  }
  
  // Agregar contenido específico del reporte
  if (reportId && data.summary) {
    csvContent += addCSVReportSpecificContent(data, reportId);
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
    'growth-trends': 'Reporte de Tendencias de Crecimiento'
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

function addReportSpecificContent(doc: jsPDF, data: ReportData, reportId: string, startY: number): void {
  // Agregar contenido específico según el tipo de reporte
  switch (reportId) {
    case 'sales-summary':
      if (data.salesTrends) {
        // Agregar datos de tendencias de ventas
        doc.text('Tendencias de Ventas', 14, startY);
      }
      break;
    case 'customer-analysis':
      if (data.topCustomers) {
        // Agregar datos de top clientes
        doc.text('Principales Clientes', 14, startY);
      }
      break;
    // Agregar más casos según sea necesario
  }
}

function addExcelReportSpecificSheets(workbook: XLSX.WorkBook, data: ReportData, reportId: string): void {
  switch (reportId) {
    case 'sales-summary':
      if (data.salesTrends && data.salesTrends.daily) {
        const dailyData = [
          ['Fecha', 'Ventas', 'Órdenes'],
          ...data.salesTrends.daily.map((item: any) => [
            item.date,
            item.sales,
            item.orders
          ])
        ];
        const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
        XLSX.utils.book_append_sheet(workbook, dailySheet, 'Ventas Diarias');
      }
      break;
    case 'customer-analysis':
      if (data.topCustomers) {
        const customersData = [
          ['Cliente', 'Email', 'Total Gastado', 'Órdenes'],
          ...data.topCustomers.map((customer: any) => [
            customer.name,
            customer.email,
            customer.totalSpent,
            customer.orderCount
          ])
        ];
        const customersSheet = XLSX.utils.aoa_to_sheet(customersData);
        XLSX.utils.book_append_sheet(workbook, customersSheet, 'Top Clientes');
      }
      break;
    // Agregar más casos según sea necesario
  }
}

function addCSVReportSpecificContent(data: ReportData, reportId: string): string {
  let content = '';
  
  switch (reportId) {
    case 'sales-summary':
      if (data.salesTrends && data.salesTrends.daily) {
        content += 'VENTAS DIARIAS\n';
        content += 'Fecha,Ventas,Órdenes\n';
        data.salesTrends.daily.forEach((item: any) => {
          content += `${item.date},${item.sales},${item.orders}\n`;
        });
        content += '\n';
      }
      break;
    case 'customer-analysis':
      if (data.topCustomers) {
        content += 'PRINCIPALES CLIENTES\n';
        content += 'Cliente,Email,Total Gastado,Órdenes\n';
        data.topCustomers.forEach((customer: any) => {
          content += `"${customer.name}","${customer.email}",${customer.totalSpent},${customer.orderCount}\n`;
        });
        content += '\n';
      }
      break;
    // Agregar más casos según sea necesario
  }
  
  return content;
}
