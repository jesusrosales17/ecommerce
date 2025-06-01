import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }    // Obtener estadísticas generales
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      lowStockProducts,
      monthlyStats,
      orderStatusStats
    ] = await Promise.all([
      // Total de usuarios
      prisma.user.count({
        where: { role: 'USER' }
      }),

      // Total de productos activos
      prisma.product.count({
        where: { status: 'ACTIVE' }
      }),

      // Total de categorías activas
      prisma.category.count({
        where: { status: 'ACTIVE' }
      }),

      // Total de órdenes
      prisma.order.count(),

      // Órdenes pendientes
      prisma.order.count({
        where: { status: 'PENDING' }
      }),

      // Ingresos totales
      prisma.order.aggregate({
        where: { 
          status: { not: 'CANCELLED' }
        },
        _sum: { total: true }
      }),

      // Órdenes recientes (últimas 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          User: {
            select: { name: true, email: true }
          },
          items: {
            include: {
              Product: {
                select: { name: true }
              }
            }
          }
        }
      }),

      // Productos más vendidos
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),

      // Productos con stock bajo (menos de 10)
      prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          stock: { lt: 10 }
        },
        select: {
          id: true,
          name: true,
          stock: true,
          category: {
            select: { name: true }
          }
        },
        take: 5
      }),      // Estadísticas mensuales (últimos 6 meses)
      prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(createdAt, '%Y-%m') as month,
          COUNT(*) as orders,
          SUM(total) as revenue
        FROM \`order\`
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          AND status != 'CANCELLED'
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month DESC
      `,

      // Estadísticas de estado de órdenes
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      })
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
          totalSold: item._sum.quantity
        };
      })
    );

    // Calcular crecimiento de usuarios (último mes vs mes anterior)
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(currentMonth.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(currentMonth.getMonth() - 2);

    const [currentMonthUsers, lastMonthUsers] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'USER',
          createdAt: {
            gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
          }
        }
      })
    ]);    const userGrowthPercentage = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;

    // Helper function to convert BigInt to number
    const convertBigIntToNumber = (value: any): any => {
      if (typeof value === 'bigint') {
        return Number(value);
      }
      if (Array.isArray(value)) {
        return value.map(convertBigIntToNumber);
      }
      if (value !== null && typeof value === 'object') {
        const converted: any = {};
        for (const [key, val] of Object.entries(value)) {
          converted[key] = convertBigIntToNumber(val);
        }
        return converted;
      }
      return value;
    };    // Convert monthly stats to handle BigInt values
    const convertedMonthlyStats = convertBigIntToNumber(monthlyStats);

    // Formatear los datos de estado de órdenes
    const statusColors = {
      PENDING: "#f59e0b",
      PROCESSING: "#3b82f6", 
      SHIPPED: "#6366f1",
      DELIVERED: "#10b981",
      CANCELLED: "#ef4444"
    };

    const orderStatusData = orderStatusStats.map(stat => ({
      status: stat.status,
      count: stat._count.status,
      color: statusColors[stat.status as keyof typeof statusColors] || "#6b7280"
    }));

    const dashboardStats = {
      overview: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        userGrowthPercentage: Math.round(userGrowthPercentage * 100) / 100
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
        customerName: order.User.name,
        customerEmail: order.User.email,
        itemsCount: order.items.length
      })),
      topProducts: topProductsDetails.map(product => ({
        ...product,
        price: Number(product?.price || 0),
        totalSold: Number(product?.totalSold || 0)      })),
      lowStockProducts,
      monthlyStats: convertedMonthlyStats,
      orderStatusData
    };

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
