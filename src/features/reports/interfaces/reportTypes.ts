export interface ReportData {
  quickStats: {
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
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    category: { name: string } | null;
    totalSold: number;
  }>;
  recentReports: Array<{
    name: string;
    type: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  monthlyStats: Array<{
    month: string;
    orders: number;
    revenue: number;
  }>;
  orderStatusData: Array<{
    status: string;
    count: number;
    color: string;
  }>;
}

export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  category: 'sales' | 'customers' | 'inventory' | 'financial';
}
