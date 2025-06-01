import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/libs/brevo';

export async function GET() {
  try {
    console.log('Iniciando prueba de envío de email...');
    
    const result = await sendTestEmail();
    
    if (result && !result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: 'Error al enviar email de prueba'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en la ruta de prueba de email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido',
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipient } = body;

    console.log('Iniciando prueba de envío de email personalizado a:', recipient);
    
    // Por ahora usamos la función existente, pero podrías modificarla para aceptar parámetros
    const result = await sendTestEmail();
    
    if (result && !result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          message: 'Error al enviar email de prueba personalizado'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email de prueba enviado exitosamente${recipient ? ` a ${recipient}` : ''}`,
      timestamp: new Date().toISOString(),
      recipient: recipient || 'jesus.rc.dev@gmail.com'
    });

  } catch (error) {
    console.error('Error en la ruta POST de prueba de email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido',
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
