import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const { reportId } = await params;
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';

    // Calcular fechas basadas en el rango
    const { startDate, endDate } = getDateRange(dateRange);

    let reportData;

    // Generar reporte según el tipo
    switch (reportId) {
      case 'sales-summary':
        reportData = await generateSalesSummaryReport(startDate, endDate);
        break;
      
      case 'customer-analysis':
        reportData = await generateCustomerAnalysisReport(startDate, endDate);
        break;
      
      case 'product-performance':
        reportData = await generateProductPerformanceReport(startDate, endDate);
        break;
      
      case 'financial-report':
        reportData = await generateFinancialReport(startDate, endDate);
        break;
        case 'orders-analysis':
        reportData = await generateOrdersAnalysisReport(startDate, endDate);
        break;
      
      default:
        return NextResponse.json(
          { error: "Tipo de reporte no reconocido" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      reportId,
      data: reportData,
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        label: formatDateRangeText(dateRange)
      }
    });

  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos del reporte" },
      { status: 500 }
    );
  }
}

// Funciones auxiliares

function getDateRange(range: string) {
  const endDate = new Date();
  const startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return { startDate, endDate };
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

// Función para generar reporte de resumen de ventas
async function generateSalesSummaryReport(startDate: Date, endDate: Date) {
  const [
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts,
    salesByDay,
    salesByCategory,
    orderStatusBreakdown,
    topCustomers
  ] = await Promise.all([
    // Total de ventas
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true }
    }),

    // Total de órdenes
    prisma.order.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),

    // Valor promedio por orden
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate, lte: endDate }
      },
      _avg: { total: true }
    }),

    // Top productos vendidos
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        Order: {
          createdAt: { gte: startDate, lte: endDate },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    }),

    // Ventas por día
    prisma.$queryRaw<Array<{
      date: string;
      sales: number;
      orders: bigint;
    }>>`
      SELECT 
        DATE(createdAt) as date,
        SUM(total) as sales,
        COUNT(*) as orders
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
        AND status != 'CANCELLED'
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `,

    // Ventas por categoría
    prisma.$queryRaw<Array<{
      categoryName: string;
      totalSales: number;
      totalQuantity: bigint;
    }>>`
      SELECT 
        c.name as categoryName,
        SUM(oi.price * oi.quantity) as totalSales,
        SUM(oi.quantity) as totalQuantity
      FROM orderitem oi
      JOIN product p ON oi.productId = p.id
      JOIN category c ON p.categoryId = c.id
      JOIN \`order\` o ON oi.orderId = o.id
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      GROUP BY c.id, c.name
      ORDER BY totalSales DESC
    `,

    // Breakdown por estado de orden
    prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: { status: true },
      _sum: { total: true }
    }),

    // Top clientes por valor
    prisma.$queryRaw<Array<{
      userId: string;
      userName: string;
      userEmail: string;
      totalSpent: number;
      orderCount: bigint;
    }>>`
      SELECT 
        u.id as userId,
        u.name as userName,
        u.email as userEmail,
        COALESCE(SUM(o.total), 0) as totalSpent,
        COUNT(o.id) as orderCount
      FROM user u
      LEFT JOIN \`order\` o ON u.id = o.userId 
        AND o.status != 'CANCELLED'
        AND o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
      WHERE u.role = 'USER'
      GROUP BY u.id, u.name, u.email
      HAVING totalSpent > 0
      ORDER BY totalSpent DESC
      LIMIT 10
    `
  ]);

  // Enriquecer datos de productos
  const enrichedProducts = await enrichProductData(topProducts);

  return {
    summary: {
      totalRevenue: Number(totalSales._sum.total || 0),
      totalOrders,
      averageOrderValue: Number(averageOrderValue._avg.total || 0),
      conversionRate: 2.4 // Simulado - en una app real se calcularía
    },
    topProducts: enrichedProducts,
    topCustomers: topCustomers.map(customer => ({
      id: customer.userId,
      name: customer.userName,
      email: customer.userEmail,
      totalSpent: Number(customer.totalSpent),
      orderCount: Number(customer.orderCount)
    })),
    salesTrends: {
      daily: salesByDay.map(item => ({
        date: item.date,
        sales: Number(item.sales),
        orders: Number(item.orders)
      })),
      byCategory: salesByCategory.map(item => ({
        name: item.categoryName,
        revenue: Number(item.totalSales),
        products: 0, // Se podría calcular si es necesario
        sales: Number(item.totalQuantity)
      }))
    },
    orderStatus: orderStatusBreakdown.map(item => ({
      status: item.status,
      count: item._count.status,
      revenue: Number(item._sum.total || 0)
    }))
  };
}

// Función para generar reporte de análisis de clientes
async function generateCustomerAnalysisReport(startDate: Date, endDate: Date) {
  const [
    totalCustomers,
    newCustomers,
    topCustomers,
    customersByRegion,
    repeatCustomerRate
  ] = await Promise.all([
    // Total de clientes
    prisma.user.count({
      where: { role: 'USER' }
    }),

    // Nuevos clientes en el período
    prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: startDate, lte: endDate }
      }
    }),

    // Top clientes por valor total
    prisma.$queryRaw<Array<{
      userId: string;
      userName: string;
      userEmail: string;
      totalSpent: number;
      orderCount: bigint;
      lastOrderDate: Date;
    }>>`
      SELECT 
        u.id as userId,
        u.name as userName,
        u.email as userEmail,
        COALESCE(SUM(o.total), 0) as totalSpent,
        COUNT(o.id) as orderCount,
        MAX(o.createdAt) as lastOrderDate
      FROM user u
      LEFT JOIN \`order\` o ON u.id = o.userId AND o.status != 'CANCELLED'
      WHERE u.role = 'USER'
      GROUP BY u.id, u.name, u.email
      ORDER BY totalSpent DESC
      LIMIT 20
    `,

    // Clientes por región (usando direcciones)
    prisma.address.groupBy({
      by: ['state'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10
    }),

    // Tasa de clientes recurrentes
    prisma.$queryRaw<Array<{
      repeatCustomers: bigint;
      totalCustomers: bigint;
    }>>`
      SELECT 
        COUNT(CASE WHEN order_count > 1 THEN 1 END) as repeatCustomers,
        COUNT(*) as totalCustomers
      FROM (
        SELECT u.id, COUNT(o.id) as order_count
        FROM user u
        LEFT JOIN \`order\` o ON u.id = o.userId AND o.status != 'CANCELLED'
        WHERE u.role = 'USER'
        GROUP BY u.id
      ) as customer_orders
    `
  ]);

  const repeatRate = repeatCustomerRate[0] 
    ? (Number(repeatCustomerRate[0].repeatCustomers) / Number(repeatCustomerRate[0].totalCustomers)) * 100
    : 0;

  return {
    summary: {
      totalCustomers,
      newCustomers,
      repeatCustomerRate: repeatRate,
      averageLifetimeValue: topCustomers.length > 0 
        ? topCustomers.reduce((sum, c) => sum + Number(c.totalSpent), 0) / topCustomers.length
        : 0
    },
    topCustomers: topCustomers.map(customer => ({
      id: customer.userId,
      name: customer.userName,
      email: customer.userEmail,
      totalSpent: Number(customer.totalSpent),
      orderCount: Number(customer.orderCount),
      lastOrderDate: customer.lastOrderDate
    })),
    customersByRegion: customersByRegion.map(region => ({
      region: region.state || 'Sin especificar',
      customerCount: region._count.userId
    })),
    segmentation: {
      highValue: topCustomers.filter(c => Number(c.totalSpent) > 1000).length,
      mediumValue: topCustomers.filter(c => Number(c.totalSpent) >= 500 && Number(c.totalSpent) <= 1000).length,
      lowValue: topCustomers.filter(c => Number(c.totalSpent) < 500).length
    }
  };
}

// Función para generar reporte de rendimiento de productos
async function generateProductPerformanceReport(startDate: Date, endDate: Date) {
  const [
    bestSellingProducts,
    categoryPerformance,
    inventoryStatus,
    profitabilityData
  ] = await Promise.all([
    // Productos más vendidos
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        Order: {
          createdAt: { gte: startDate, lte: endDate },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 20
    }),

    // Rendimiento por categoría
    prisma.$queryRaw<Array<{
      categoryId: string;
      categoryName: string;
      totalRevenue: number;
      totalQuantity: bigint;
      productCount: bigint;
    }>>`
      SELECT 
        c.id as categoryId,
        c.name as categoryName,
        COALESCE(SUM(oi.price * oi.quantity), 0) as totalRevenue,
        COALESCE(SUM(oi.quantity), 0) as totalQuantity,
        COUNT(DISTINCT p.id) as productCount
      FROM category c
      LEFT JOIN product p ON c.id = p.categoryId
      LEFT JOIN orderitem oi ON p.id = oi.productId
      LEFT JOIN \`order\` o ON oi.orderId = o.id
        AND o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      WHERE c.status = 'ACTIVE'
      GROUP BY c.id, c.name
      ORDER BY totalRevenue DESC
    `,

    // Estado del inventario
    prisma.product.groupBy({
      by: ['status'],
      where: {
        status: 'ACTIVE'
      },
      _count: { id: true },
      _avg: { stock: true }
    }),

    // Datos de rentabilidad (productos activos con ventas)
    prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OrderItem: {
          some: {
            Order: {
              createdAt: { gte: startDate, lte: endDate },
              status: { not: 'CANCELLED' }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: { select: { name: true } },
        OrderItem: {
          where: {
            Order: {
              createdAt: { gte: startDate, lte: endDate },
              status: { not: 'CANCELLED' }
            }
          },
          select: {
            quantity: true,
            price: true
          }
        }
      },
      take: 50
    })
  ]);

  const enrichedProducts = await enrichProductData(bestSellingProducts);

  return {
    topPerformers: enrichedProducts,
    categoryAnalysis: categoryPerformance.map(cat => ({
      categoryId: cat.categoryId,
      name: cat.categoryName,
      revenue: Number(cat.totalRevenue),
      quantity: Number(cat.totalQuantity),
      productCount: Number(cat.productCount)
    })),
    inventoryInsights: {
      lowStock: profitabilityData.filter(p => p.stock! < 10 ).length,
      outOfStock: profitabilityData.filter(p => p.stock === 0).length,
      totalActiveProducts: inventoryStatus.reduce((sum, status) => sum + status._count.id, 0),
      averageStock: inventoryStatus.length > 0 
        ? inventoryStatus.reduce((sum, status) => sum + Number(status._avg.stock || 0), 0) / inventoryStatus.length
        : 0
    },
    profitabilityAnalysis: profitabilityData.map(product => {
      const totalQuantitySold = product.OrderItem.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = product.OrderItem.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
        category: product.category?.name || 'Sin categoría',
        totalSold: totalQuantitySold,
        totalRevenue: totalRevenue,
        profitMargin: totalRevenue > 0 ? ((totalRevenue - (Number(product.price) * totalQuantitySold)) / totalRevenue) * 100 : 0
      };
    })
  };
}

// Función para generar reporte financiero
async function generateFinancialReport(startDate: Date, endDate: Date) {
  const [
    revenueData,
    salesByCategory,
    salesByProduct,
    salesByDay
  ] = await Promise.all([
    // Datos de ingresos generales
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true },
      _count: true,
      _avg: { total: true }
    }),

    // Ventas por categoría
    prisma.$queryRaw<Array<{
      categoryName: string;
      totalSales: number;
      totalQuantity: bigint;
      orderCount: bigint;
    }>>`
      SELECT 
        c.name as categoryName,
        SUM(oi.price * oi.quantity) as totalSales,
        SUM(oi.quantity) as totalQuantity,
        COUNT(DISTINCT o.id) as orderCount
      FROM orderitem oi
      JOIN product p ON oi.productId = p.id
      JOIN category c ON p.categoryId = c.id
      JOIN \`order\` o ON oi.orderId = o.id
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      GROUP BY c.id, c.name
      ORDER BY totalSales DESC
    `,

    // Top productos vendidos
    prisma.$queryRaw<Array<{
      productName: string;
      categoryName: string;
      totalSales: number;
      totalQuantity: bigint;
      averagePrice: number;
    }>>`
      SELECT 
        p.name as productName,
        c.name as categoryName,
        SUM(oi.price * oi.quantity) as totalSales,
        SUM(oi.quantity) as totalQuantity,
        AVG(oi.price) as averagePrice
      FROM orderitem oi
      JOIN product p ON oi.productId = p.id
      JOIN category c ON p.categoryId = c.id
      JOIN \`order\` o ON oi.orderId = o.id
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      GROUP BY p.id, p.name, c.name
      ORDER BY totalSales DESC
      LIMIT 10
    `,

    // Ventas por día
    prisma.$queryRaw<Array<{
      date: string;
      totalSales: number;
      orderCount: bigint;
    }>>`
      SELECT 
        DATE(o.createdAt) as date,
        SUM(o.total) as totalSales,
        COUNT(*) as orderCount
      FROM \`order\` o
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      GROUP BY DATE(o.createdAt)
      ORDER BY date DESC
    `
  ]);

  const totalRevenue = Number(revenueData._sum.total || 0);
  const totalOrders = Number(revenueData._count || 0);
  const averageOrderValue = Number(revenueData._avg.total || 0);

  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      salesGrowth: 0 // Esto requeriría comparar con período anterior
    },
    salesByCategory: salesByCategory.map(category => ({
      category: category.categoryName,
      totalSales: Number(category.totalSales),
      totalQuantity: Number(category.totalQuantity),
      orderCount: Number(category.orderCount)
    })),
    topProducts: salesByProduct.map(product => ({
      name: product.productName,
      category: product.categoryName,
      totalSales: Number(product.totalSales),
      totalQuantity: Number(product.totalQuantity),
      averagePrice: Number(product.averagePrice)
    })),
    dailySales: salesByDay.map(day => ({
      date: day.date,
      totalSales: Number(day.totalSales),
      orderCount: Number(day.orderCount)
    }))
  };
}

// Función para generar reporte de análisis de órdenes
async function generateOrdersAnalysisReport(startDate: Date, endDate: Date) {
  const [
    ordersByStatus,
    ordersByDay,
    averageProcessingTime,
    orderSizeDistribution
  ] = await Promise.all([
    // Órdenes por estado
    prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: { status: true },
      _sum: { total: true }
    }),

    // Órdenes por día
    prisma.$queryRaw<Array<{
      date: string;
      orderCount: bigint;
      totalRevenue: number;
    }>>`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orderCount,
        SUM(total) as totalRevenue
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `,

    // Tiempo promedio de procesamiento (simulado)
    Promise.resolve({
      averageProcessingHours: 24,
      averageShippingHours: 48,
      averageDeliveryDays: 3
    }),

    // Distribución del tamaño de órdenes
    prisma.$queryRaw<Array<{
      orderRange: string;
      orderCount: bigint;
    }>>`
      SELECT 
        CASE 
          WHEN total < 50 THEN '< $50'
          WHEN total >= 50 AND total < 100 THEN '$50 - $100'
          WHEN total >= 100 AND total < 200 THEN '$100 - $200'
          WHEN total >= 200 AND total < 500 THEN '$200 - $500'
          ELSE '$500+'
        END as orderRange,
        COUNT(*) as orderCount
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
        AND status != 'CANCELLED'
      GROUP BY orderRange
      ORDER BY MIN(total)
    `
  ]);

  return {
    statusBreakdown: ordersByStatus.map(status => ({
      status: status.status,
      count: status._count.status,
      revenue: Number(status._sum.total || 0)
    })),
    dailyTrends: ordersByDay.map(day => ({
      date: day.date,
      orders: Number(day.orderCount),
      revenue: Number(day.totalRevenue)
    })),
    processingMetrics: averageProcessingTime,
    orderSizeDistribution: orderSizeDistribution.map(range => ({
      range: range.orderRange,
      count: Number(range.orderCount)
    }))
  };
}



// Función auxiliar para enriquecer datos de productos
async function enrichProductData(productData: any[]) {
  return Promise.all(
    productData.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
          category: {
            select: { name: true }
          }
        }
      });
      return {
        id: product?.id || item.productId,
        name: product?.name || 'Producto eliminado',
        price: Number(product?.price || 0),
        category: product?.category || null,
        totalSold: Number(item._sum?.quantity || 0),
        totalRevenue: Number(item._sum?.price || 0)
      };
    })
  );
}

// Función auxiliar para calcular tasa de crecimiento
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
