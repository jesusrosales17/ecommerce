import { ReportData } from "../interfaces/reportTypes";

export class ReportService {
  static async generateReport(reportId: string, dateRange: string = '30d'): Promise<void> {
    try {
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId, dateRange }),
      });

      if (!response.ok) {
        throw new Error(`Error generating report: ${response.statusText}`);
      }

      // Optionally return the generated report data or confirmation
      return await response.json();
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  static async exportReport(format: 'pdf' | 'excel' | 'csv', data: ReportData): Promise<void> {
    try {
      const response = await fetch('/api/admin/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format, data }),
      });

      if (!response.ok) {
        throw new Error(`Error exporting report: ${response.statusText}`);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Set filename based on format
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `reporte-${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  static async previewReport(reportId: string): Promise<void> {
    try {
      // This could open a modal or navigate to a preview page
      console.log(`Previewing report: ${reportId}`);
      // Implementation would depend on your UI library and requirements
    } catch (error) {
      console.error('Error previewing report:', error);
      throw error;
    }
  }

  static async downloadReport(reportName: string): Promise<void> {
    try {
      const response = await fetch(`/api/admin/reports/download/${encodeURIComponent(reportName)}`);
      
      if (!response.ok) {
        throw new Error(`Error downloading report: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportName;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  static async viewReport(reportName: string): Promise<void> {
    try {
      // This could open the report in a new tab or modal
      const url = `/api/admin/reports/view/${encodeURIComponent(reportName)}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing report:', error);
      throw error;
    }
  }
}
