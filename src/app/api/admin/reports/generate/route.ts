import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const body = await request.json();
    const { reportId, reportType, dateRange, filters } = body;

    if (!reportId || !reportType) {
      return NextResponse.json(
        { error: "reportId y reportType son requeridos" },
        { status: 400 }
      );
    }

    // Calcular fechas basadas en el rango
    const { startDate, endDate } = getDateRange(dateRange || '30d');

    let reportData;

    // Generar reporte según el tipo
    switch (reportId) {
      case 'sales-summary':
        reportData = await generateSalesSummaryReport(startDate, endDate, filters);
        break;
      
      case 'customer-analysis':
        reportData = await generateCustomerAnalysisReport(startDate, endDate, filters);
        break;
      
      case 'product-performance':
        reportData = await generateProductPerformanceReport(startDate, endDate, filters);
        break;
      
      case 'financial-report':
        reportData = await generateFinancialReport(startDate, endDate, filters);
        break;
      
      case 'orders-analysis':
        reportData = await generateOrdersAnalysisReport(startDate, endDate, filters);
        break;
      
      default:
        return NextResponse.json(
          { error: "Tipo de reporte no reconocido" },
          { status: 400 }
        );
    }

    // En una implementación real, aquí se guardaría el reporte en la base de datos
    // y se podría programar la generación del archivo (PDF, Excel, etc.)

    return NextResponse.json({
      success: true,
      reportId,
      reportType,
      data: reportData,
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Error al generar el reporte" },
      { status: 500 }
    );
  }
}

// Funciones para generar reportes específicos

async function generateSalesSummaryReport(startDate: Date, endDate: Date, filters: string[]) {
  const [
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts,
    salesByDay,
    salesByCategory,
    orderStatusBreakdown
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
    })
  ]);

  return {
    summary: {
      totalSales: Number(totalSales._sum.total || 0),
      totalOrders,
      averageOrderValue: Number(averageOrderValue._avg.total || 0),
      conversionRate: 0.024 // Simulado - en una app real se calcularía
    },
    topProducts: await enrichProductData(topProducts),
    salesTrends: {
      daily: salesByDay.map(item => ({
        date: item.date,
        sales: Number(item.sales),
        orders: Number(item.orders)
      })),
      byCategory: salesByCategory.map(item => ({
        category: item.categoryName,
        sales: Number(item.totalSales),
        quantity: Number(item.totalQuantity)
      }))
    },
    orderStatus: orderStatusBreakdown.map(item => ({
      status: item.status,
      count: item._count.status,
      revenue: Number(item._sum.total || 0)
    }))
  };
}

async function generateCustomerAnalysisReport(startDate: Date, endDate: Date, filters: string[]) {
  const [
    totalCustomers,
    newCustomers,
    customerLifetimeValue,
    topCustomers,
    customersByRegion,
    repeatCustomerRate
  ] = await Promise.all([
    // Total de clientes únicos con órdenes
    prisma.user.count({
      where: {
        role: 'USER',
        Order: {
          some: {
            createdAt: { gte: startDate, lte: endDate }
          }
        }
      }
    }),

    // Nuevos clientes en el período
    prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: startDate, lte: endDate }
      }
    }),

    // Valor promedio de vida del cliente
    prisma.$queryRaw<Array<{
      averageLifetimeValue: number;
    }>>`
      SELECT AVG(customer_total) as averageLifetimeValue
      FROM (
        SELECT u.id, COALESCE(SUM(o.total), 0) as customer_total
        FROM user u
        LEFT JOIN \`order\` o ON u.id = o.userId AND o.status != 'CANCELLED'
        WHERE u.role = 'USER'
        GROUP BY u.id
      ) as customer_totals
    `,

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
    `,

    // Clientes por región (simulado - asumir que hay datos de dirección)
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
        LEFT JOIN \`order\` o ON u.id = o.userId 
          AND o.status != 'CANCELLED'
          AND o.createdAt >= ${startDate}
          AND o.createdAt <= ${endDate}
        WHERE u.role = 'USER'
        GROUP BY u.id
        HAVING order_count > 0
      ) as customer_orders
    `
  ]);

  return {
    overview: {
      totalCustomers,
      newCustomers,
      averageLifetimeValue: Number(customerLifetimeValue[0]?.averageLifetimeValue || 0),
      repeatCustomerRate: repeatCustomerRate.length > 0 
        ? (Number(repeatCustomerRate[0].repeatCustomers) / Number(repeatCustomerRate[0].totalCustomers)) * 100
        : 0
    },
    topCustomers: topCustomers.map(customer => ({
      id: customer.userId,
      name: customer.userName,
      email: customer.userEmail,
      totalSpent: Number(customer.totalSpent),
      orderCount: Number(customer.orderCount)
    })),
    demographics: {
      byRegion: customersByRegion.map(region => ({
        state: region.state,
        customerCount: region._count.userId
      }))
    }
  };
}

async function generateProductPerformanceReport(startDate: Date, endDate: Date, filters: string[]) {
  const [
    bestSellingProducts,
    worstPerformingProducts,
    categoryPerformance,
    inventoryStatus,
    profitabilityAnalysis
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

    // Productos con menos ventas
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        Order: {
          createdAt: { gte: startDate, lte: endDate },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'asc' } },
      take: 10
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

    // Análisis de rentabilidad (simulado)
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

  return {
    topPerformers: await enrichProductData(bestSellingProducts),
    topProducts: await enrichProductData(bestSellingProducts),
    underPerformers: await enrichProductData(worstPerformingProducts),
    categoryAnalysis: categoryPerformance.map(cat => ({
      name: cat.categoryName,
      products: Number(cat.productCount),
      revenue: Number(cat.totalRevenue),
      sales: Number(cat.totalQuantity),
      percentage: 0 // Si tienes el porcentaje real, cámbialo aquí
    })),
    inventoryHealth: {
      totalActiveProducts: inventoryStatus.reduce((sum, item) => sum + item._count.id, 0),
      averageStock: inventoryStatus.length > 0 
        ? Number(inventoryStatus[0]._avg.stock || 0) 
        : 0
    },
    profitability: profitabilityAnalysis.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      totalSold: product.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
      totalRevenue: product.OrderItem.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0),
      estimatedProfit: product.OrderItem.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) * 0.3 // 30% margen estimado
    }))
  };
}

async function generateFinancialReport(startDate: Date, endDate: Date, filters: string[]) {
  const [
    totalRevenue,
    totalCosts,
    profitMargins,
    paymentMethods,
    refundsAndCancellations,
    financialTrends
  ] = await Promise.all([
    // Ingresos totales
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true },
      _count: { id: true }
    }),

    // Costos estimados (simulado - 70% del precio como costo)
    prisma.$queryRaw<Array<{
      estimatedCosts: number;
    }>>`
      SELECT SUM(oi.price * oi.quantity * 0.7) as estimatedCosts
      FROM orderitem oi
      JOIN \`order\` o ON oi.orderId = o.id
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
    `,

    // Márgenes por categoría
    prisma.$queryRaw<Array<{
      categoryName: string;
      revenue: number;
      estimatedCost: number;
    }>>`
      SELECT 
        c.name as categoryName,
        SUM(oi.price * oi.quantity) as revenue,
        SUM(oi.price * oi.quantity * 0.7) as estimatedCost
      FROM orderitem oi
      JOIN product p ON oi.productId = p.id
      JOIN category c ON p.categoryId = c.id
      JOIN \`order\` o ON oi.orderId = o.id
      WHERE o.createdAt >= ${startDate}
        AND o.createdAt <= ${endDate}
        AND o.status != 'CANCELLED'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `,    // Métodos de pago (basado en paymentStatus)
    prisma.order.groupBy({
      by: ['paymentStatus'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' },
        paymentStatus: { not: null }
      },
      _count: { id: true },
      _sum: { total: true }
    }),

    // Reembolsos y cancelaciones
    prisma.order.aggregate({
      where: {
        status: 'CANCELLED',
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { total: true },
      _count: { id: true }
    }),

    // Tendencias financieras mensuales
    prisma.$queryRaw<Array<{
      month: string;
      revenue: number;
      orders: bigint;
      averageOrderValue: number;
    }>>`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        SUM(total) as revenue,
        COUNT(*) as orders,
        AVG(total) as averageOrderValue
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
        AND status != 'CANCELLED'
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month DESC
    `
  ]);

  const revenue = Number(totalRevenue._sum.total || 0);
  const costs = Number(totalCosts[0]?.estimatedCosts || 0);
  const profit = revenue - costs;

  return {
    summary: {
      totalRevenue: revenue,
      totalCosts: costs,
      grossProfit: profit,
      profitMargin: revenue > 0 ? (profit / revenue) * 100 : 0,
      totalOrders: totalRevenue._count.id
    },
    categoryMargins: profitMargins.map(cat => ({
      category: cat.categoryName,
      revenue: Number(cat.revenue),
      costs: Number(cat.estimatedCost),
      margin: Number(cat.revenue) > 0 
        ? ((Number(cat.revenue) - Number(cat.estimatedCost)) / Number(cat.revenue)) * 100 
        : 0
    })),    paymentAnalysis: paymentMethods.map(method => ({
      method: method.paymentStatus || 'unknown',
      count: method._count?.id || 0,
      total: Number(method._sum?.total || 0)
    })),
    losses: {
      cancelledOrders: refundsAndCancellations._count.id,
      lostRevenue: Number(refundsAndCancellations._sum.total || 0)
    },
    trends: financialTrends.map(trend => ({
      month: trend.month,
      revenue: Number(trend.revenue),
      orders: Number(trend.orders),
      averageOrderValue: Number(trend.averageOrderValue)
    }))
  };
}

async function generateOrdersAnalysisReport(startDate: Date, endDate: Date, filters: string[]) {
  const [
    orderStats,
    ordersByStatus,
    ordersByPaymentMethod,
    averageProcessingTime,
    abandonedCarts,
    conversionRates
  ] = await Promise.all([
    // Estadísticas generales de órdenes
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: { id: true },
      _avg: { total: true },
      _sum: { total: true }
    }),

    // Órdenes por estado
    prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: { status: true },
      _avg: { total: true }
    }),    // Órdenes por método de pago (basado en paymentStatus)
    prisma.order.groupBy({
      by: ['paymentStatus'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: { not: null }
      },
      _count: { id: true },
      _sum: { total: true }
    }),

    // Tiempo promedio de procesamiento (simulado)
    prisma.$queryRaw<Array<{
      status: string;
      avgProcessingHours: number;
    }>>`
      SELECT 
        status,
        AVG(TIMESTAMPDIFF(HOUR, createdAt, updatedAt)) as avgProcessingHours
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
        AND status IN ('PROCESSING', 'SHIPPED', 'DELIVERED')
      GROUP BY status
    `,

    // Carritos abandonados (simulado basado en carritos vs órdenes)
    prisma.cart.count({
      where: {
        updatedAt: { gte: startDate, lte: endDate },
        items: {
          some: {}
        }
      }
    }),

    // Tasas de conversión por hora (simulado)
    prisma.$queryRaw<Array<{
      hour: number;
      orders: bigint;
    }>>`
      SELECT 
        HOUR(createdAt) as hour,
        COUNT(*) as orders
      FROM \`order\`
      WHERE createdAt >= ${startDate}
        AND createdAt <= ${endDate}
      GROUP BY HOUR(createdAt)
      ORDER BY hour
    `
  ]);

  return {
    overview: {
      totalOrders: orderStats._count.id,
      averageOrderValue: Number(orderStats._avg.total || 0),
      totalRevenue: Number(orderStats._sum.total || 0)
    },
    statusBreakdown: ordersByStatus.map(status => ({
      status: status.status,
      count: status._count.status,
      averageValue: Number(status._avg.total || 0)
    })),    paymentMethodAnalysis: ordersByPaymentMethod.map(method => ({
      method: method.paymentStatus || 'unknown',
      count: method._count?.id || 0,
      total: Number(method._sum?.total || 0)
    })),
    processingTimes: averageProcessingTime.map(time => ({
      status: time.status,
      averageHours: Number(time.avgProcessingHours || 0)
    })),
    conversionMetrics: {
      abandonedCarts,
      conversionByHour: conversionRates.map(rate => ({
        hour: rate.hour,
        orders: Number(rate.orders)
      }))
    }
  };
}

// La función generateGrowthTrendsReport ha sido eliminada

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

function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
