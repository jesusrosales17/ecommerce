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

    // Calcular fechas basadas en el rango seleccionado
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Obtener estadísticas en paralelo
    const [
      totalRevenue,
      totalOrders,
      newCustomers,
      totalProductsSold,
      topProducts,
      recentReports
    ] = await Promise.all([
      // Ingresos totales en el rango de fechas
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startDate }
        },
        _sum: { total: true }
      }),

      // Total de órdenes en el rango
      prisma.order.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Nuevos clientes en el rango
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: startDate }
        }
      }),      // Total de productos vendidos
      prisma.orderItem.aggregate({
        where: {
          Order: {
            createdAt: { gte: startDate },
            status: { not: 'CANCELLED' }
          }
        },
        _sum: { quantity: true }
      }),

      // Top 5 productos más vendidos
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          Order: {
            createdAt: { gte: startDate },
            status: { not: 'CANCELLED' }
          }
        },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),

      // Reportes recientes simulados (en una implementación real, estos vendrían de una tabla de reportes)
      prisma.order.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          status: true,
          total: true
        }
      })
    ]);    // Obtener detalles de productos más vendidos
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
          totalSold: item._sum?.quantity || 0
        };
      })
    );

    // Calcular cambios porcentuales (comparar con período anterior)
    const previousStartDate = new Date(startDate);
    const periodDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    previousStartDate.setDate(previousStartDate.getDate() - periodDays);

    const [
      previousRevenue,
      previousOrders,
      previousCustomers,
      previousProductsSold
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { 
            gte: previousStartDate,
            lt: startDate
          }
        },
        _sum: { total: true }
      }),

      prisma.order.count({
        where: {
          createdAt: { 
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),

      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: { 
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),

      prisma.orderItem.aggregate({
        where: {
          Order: {
            createdAt: { 
              gte: previousStartDate,
              lt: startDate
            },
            status: { not: 'CANCELLED' }
          }
        },
        _sum: { quantity: true }
      })
    ]);

    // Helper para calcular porcentaje de cambio
    const calculatePercentageChange = (current: number, previous: number): { change: string, trend: 'up' | 'down' } => {
      if (previous === 0) {
        return { change: current > 0 ? '+100%' : '0%', trend: 'up' };
      }
      const percentage = ((current - previous) / previous) * 100;
      return {
        change: `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`,
        trend: percentage >= 0 ? 'up' : 'down'
      };
    };    const currentRevenue = Number(totalRevenue._sum?.total || 0);
    const prevRevenue = Number(previousRevenue._sum?.total || 0);
    const currentProductsSold = Number(totalProductsSold._sum?.quantity || 0);
    const prevProductsSold = Number(previousProductsSold._sum?.quantity || 0);

    // Debug: Log para verificar los datos
    console.log('=== REPORTS DEBUG ===');
    console.log('Date range:', { startDate, endDate: now });
    console.log('Current revenue:', currentRevenue);
    console.log('Total orders:', totalOrders);
    console.log('New customers:', newCustomers);
    console.log('Products sold:', currentProductsSold);
    console.log('Top products count:', topProducts.length);
    console.log('Top products details:', topProductsDetails.length);
    console.log('===================');

    const revenueChange = calculatePercentageChange(currentRevenue, prevRevenue);
    const ordersChange = calculatePercentageChange(totalOrders, previousOrders);
    const customersChange = calculatePercentageChange(newCustomers, previousCustomers);
    const productsSoldChange = calculatePercentageChange(currentProductsSold, prevProductsSold);// Formatear datos de respuesta
    const reportData = {
      quickStats: {
        totalRevenue: currentRevenue,
        totalOrders: totalOrders,
        totalUsers: newCustomers,
        totalProducts: currentProductsSold,
        revenueChange: revenueChange.change,
        ordersChange: ordersChange.change,
        usersChange: customersChange.change,
        productsChange: productsSoldChange.change,
        revenueTrend: revenueChange.trend,
        ordersTrend: ordersChange.trend,
        usersTrend: customersChange.trend,
        productsTrend: productsSoldChange.trend
      },
      topProducts: topProductsDetails.filter(product => product !== null).map(product => ({
        id: product!.id,
        name: product!.name,
        price: Number(product!.price || 0),
        category: product!.category,
        totalSold: product!.totalSold
      })),
      recentReports: recentReports.map((order, index) => ({
        name: `Reporte de Ventas - ${order.createdAt.toLocaleDateString('es-MX')}`,
        type: index % 3 === 0 ? "sales" : index % 3 === 1 ? "inventory" : "customers",
        date: order.createdAt.toISOString().split('T')[0],
        status: "completed" as const
      })),
      monthlyStats: [], // Podemos agregar esto después si es necesario
      orderStatusData: [], // Podemos agregar esto después si es necesario
      dateRange,
      periodInfo: {
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalDays: periodDays
      }
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