import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';

    // Calcular fechas basadas en el rango
    const { startDate, endDate } = getDateRange(dateRange);

    // Ejecutar todas las consultas en paralelo
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      topProducts,
      recentReports,
      monthlyStats,
      orderStatusData,      // Datos del período anterior para comparar tendencias
      previousPeriodData
    ] = await Promise.all([
      // Ingresos totales en el período
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: { total: true }
      }),

      // Total de órdenes en el período
      prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }),

      // Total de usuarios registrados en el período
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate, lte: endDate }
        }
      }),

      // Total de productos activos
      prisma.product.count({
        where: { status: 'ACTIVE' }
      }),      // Top 5 productos más vendidos en el período
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          Order: {
            createdAt: { gte: startDate, lte: endDate },
            status: { not: 'CANCELLED' }
          }
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),

      // Reportes recientes simulados (en una implementación real, estos vendrían de una tabla de reportes)
      generateRecentReports(),

      // Estadísticas mensuales para el gráfico
      getMonthlyStats(startDate, endDate),

      // Estadísticas de estado de órdenes
      prisma.order.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        _count: { status: true }
      }),

      // Datos del período anterior para comparar tendencias
      getPreviousPeriodData(startDate, endDate)
    ]);

    // Obtener detalles de productos más vendidos
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
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
          ...product,
          totalSold: item._sum.quantity || 0
        };
      })
    );    // Calcular tendencias comparando con el período anterior
    const currentRevenue = Number(totalRevenue._sum.total || 0);
    const previousRevenue = Number(previousPeriodData.revenue._sum.total || 0);
    const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);

    const ordersChange = calculatePercentageChange(totalOrders, previousPeriodData.orders);
    const usersChange = calculatePercentageChange(totalUsers, previousPeriodData.users);

    // Formatear datos de estado de órdenes para el gráfico
    const statusColors = {
      PENDING: "#f59e0b",
      PROCESSING: "#3b82f6",
      SHIPPED: "#6366f1",
      DELIVERED: "#10b981",
      CANCELLED: "#ef4444"
    };

    const formattedOrderStatusData = orderStatusData.map(stat => ({
      status: stat.status,
      count: stat._count.status,
      color: statusColors[stat.status as keyof typeof statusColors] || "#6b7280"
    }));

    // Respuesta estructurada
    const reportData = {
      quickStats: {
        totalRevenue: currentRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        revenueChange: formatPercentageChange(revenueChange),
        ordersChange: formatPercentageChange(ordersChange),
        usersChange: formatPercentageChange(usersChange),
        productsChange: "+0.0%", // Los productos no cambian frecuentemente
        revenueTrend: revenueChange >= 0 ? 'up' : 'down',
        ordersTrend: ordersChange >= 0 ? 'up' : 'down',
        usersTrend: usersChange >= 0 ? 'up' : 'down',
        productsTrend: 'up' as const
      },
      topProducts: topProductsDetails.map(product => ({
        id: product?.id || '',
        name: product?.name || 'Producto eliminado',
        price: Number(product?.price || 0),
        category: product?.category || null,
        totalSold: Number(product?.totalSold || 0)
      })),
      recentReports,
      monthlyStats,
      orderStatusData: formattedOrderStatusData
    };

    return NextResponse.json(reportData);

  } catch (error) {
    console.error("Error fetching reports data:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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

async function getPreviousPeriodData(startDate: Date, endDate: Date) {
  const periodLength = endDate.getTime() - startDate.getTime();
  const previousStartDate = new Date(startDate.getTime() - periodLength);
  const previousEndDate = new Date(startDate.getTime());

  const [revenue, orders, users] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: previousStartDate, lte: previousEndDate }
      },
      _sum: { total: true }
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: previousStartDate, lte: previousEndDate }
      }
    }),
    prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: previousStartDate, lte: previousEndDate }
      }
    })
  ]);

  return { revenue, orders, users };
}

async function getMonthlyStats(startDate: Date, endDate: Date) {
  // Obtener estadísticas mensuales para gráficos
  const monthlyData = await prisma.$queryRaw<Array<{
    month: string;
    orders: bigint;
    revenue: number;
  }>>`
    SELECT 
      DATE_FORMAT(createdAt, '%Y-%m') as month,
      COUNT(*) as orders,
      SUM(total) as revenue
    FROM \`order\`
    WHERE createdAt >= ${startDate}
      AND createdAt <= ${endDate}
      AND status != 'CANCELLED'
    GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
    ORDER BY month DESC
    LIMIT 6
  `;

  return monthlyData.map(item => ({
    month: item.month,
    orders: Number(item.orders),
    revenue: Number(item.revenue)
  }));
}

function generateRecentReports() {
  // En una implementación real, esto vendría de una tabla de reportes
  // Por ahora generamos datos simulados
  const reportTypes = [
    'Resumen de Ventas',
    'Análisis de Clientes',
    'Rendimiento de Productos',
    'Reporte Financiero',
    'Análisis de Órdenes'
  ];

  return reportTypes.slice(0, 3).map((type, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index - 1);
    
    return {
      name: `${type} - ${date.toLocaleDateString('es-ES')}`,
      type,
      date: date.toLocaleDateString('es-ES'),
      status: index === 0 ? 'completed' : index === 1 ? 'pending' : 'completed'
    };
  });
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}
