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
