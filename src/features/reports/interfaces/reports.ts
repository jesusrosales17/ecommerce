export interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  category: { name: string } | null;
  totalSold: number;
}

export interface RecentReport {
  name: string;
  type: string;
  date: string;
  status: string;
}

export interface ReportsData {
  quickStats: QuickStat[];
  topProducts: TopProduct[];
  recentReports: RecentReport[];
  dateRange: string;
  periodInfo: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

export interface ReportType {
  id: string;
  title: string;
  description: string;
  type: "sales" | "products" | "customers" | "inventory";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface DateRange {
  value: string;
  label: string;
}

export interface ExportFormat {
  format: 'pdf' | 'excel' | 'csv';
  name: string;
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}
