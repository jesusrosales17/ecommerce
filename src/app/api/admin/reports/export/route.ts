import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/libs/auth/auth";
import { generatePDFReport, generateExcelReport, generateCSVReport } from "@/utils/export";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format'); // pdf, excel, csv
    const dateRange = searchParams.get('dateRange') || '30d';
    const reportType = searchParams.get('reportType') || 'all';

    if (!format || !['pdf', 'excel', 'csv'].includes(format)) {
      return NextResponse.json(
        { error: "Formato no válido. Use: pdf, excel, o csv" },
        { status: 400 }
      );
    }    // Obtener datos para la exportación
    // Obtener cookies de la petición original para mantener la sesión
    const cookieHeader = request.headers.get('cookie');
    
    const reportDataResponse = await fetch(`${request.nextUrl.origin}/api/admin/reports?dateRange=${dateRange}`, {
      headers: {
        cookie: cookieHeader || ''
      }
    });
    
    if (!reportDataResponse.ok) {
      throw new Error(`Error al obtener datos del reporte: ${await reportDataResponse.text()}`);
    }

    const reportData = await reportDataResponse.json();

    let fileBuffer: Buffer;
    let filename: string;
    let contentType: string;

    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'pdf':
        fileBuffer = await generatePDFReport(reportData, dateRange);
        filename = `reporte-${dateRange}-${timestamp}.pdf`;
        contentType = 'application/pdf';
        break;
      
      case 'excel':
        fileBuffer = await generateExcelReport(reportData, dateRange);
        filename = `reporte-${dateRange}-${timestamp}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      
      case 'csv':
        fileBuffer = await generateCSVReport(reportData, dateRange);
        filename = `reporte-${dateRange}-${timestamp}.csv`;
        contentType = 'text/csv';
        break;
      
      default:
        throw new Error('Formato no soportado');
    }

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { error: "Error al exportar el reporte" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const body = await request.json();
    const { format, dateRange, reportId, customData } = body;

    if (!format || !['pdf', 'excel', 'csv'].includes(format)) {
      return NextResponse.json(
        { error: "Formato no válido. Use: pdf, excel, o csv" },
        { status: 400 }
      );
    }    let reportData;    // Si hay reportId, siempre usar la misma API que usa la vista previa para consistencia
    if (reportId) {
      // Obtener cookies de la petición original para mantener la sesión
      const cookieHeader = request.headers.get('cookie');
      
      // Usar el mismo endpoint que las vistas previa para mantener consistencia de datos
      const reportResponse = await fetch(`${request.nextUrl.origin}/api/admin/reports/${reportId}?dateRange=${dateRange}`, {
        headers: {
          cookie: cookieHeader || ''
        }
      });
      
      if (!reportResponse.ok) {
        throw new Error(`Error al obtener datos del reporte específico: ${await reportResponse.text()}`);
      }
      
      const reportResult = await reportResponse.json();
      reportData = reportResult.data;
    } else if (customData) {
      // Usar datos personalizados proporcionados si no hay reportId específico
      reportData = customData;    } else {
      // Obtener cookies de la petición original para mantener la sesión
      const cookieHeader = request.headers.get('cookie');
      
      // Usar datos generales del dashboard
      const reportDataResponse = await fetch(`${request.nextUrl.origin}/api/admin/reports?dateRange=${dateRange}`, {
        headers: {
          cookie: cookieHeader || ''
        }
      });
      
      if (!reportDataResponse.ok) {
        throw new Error(`Error al obtener datos del reporte: ${await reportDataResponse.text()}`);
      }
      
      reportData = await reportDataResponse.json();
    }

    let fileBuffer: Buffer;
    let filename: string;
    let contentType: string;

    const timestamp = new Date().toISOString().split('T')[0];
    const reportName = reportId || 'general';


    console.log(reportData)

    switch (format) {
      case 'pdf':
        fileBuffer = await generatePDFReport(reportData, dateRange, reportId);
        filename = `${reportName}-${dateRange}-${timestamp}.pdf`;
        contentType = 'application/pdf';
        break;
      
      case 'excel':
        fileBuffer = await generateExcelReport(reportData, dateRange, reportId);
        filename = `${reportName}-${dateRange}-${timestamp}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      
      case 'csv':
        fileBuffer = await generateCSVReport(reportData, dateRange, reportId);
        filename = `${reportName}-${dateRange}-${timestamp}.csv`;
        contentType = 'text/csv';
        break;
      
      default:
        throw new Error('Formato no soportado');
    }

    // Configurar headers para descarga
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Error exporting custom report:", error);
    return NextResponse.json(
      { 
        error: "Error al exportar el reporte personalizado", 
        details: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    );
  }
}
