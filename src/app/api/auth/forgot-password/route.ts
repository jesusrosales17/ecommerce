import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/libs/prisma';
import { sendPasswordResetEmail } from '@/libs/brevo';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const { email } = forgotPasswordSchema.parse(body);

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Por seguridad, siempre devolvemos la misma respuesta
    // independientemente de si el usuario existe o no
    const successResponse = {
      success: true,
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación.'
    };

    if (!user) {
      return NextResponse.json(successResponse);
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Eliminar tokens previos para este email
    await prisma.passwordResetToken.deleteMany({
      where: { email }
    });

    // Crear nuevo token en la base de datos
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: hashedToken,
        expires,
        used: false
      }
    });

    // Crear enlace de recuperación
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Enviar email de recuperación
    const emailResult = await sendPasswordResetEmail(
      email,
      resetLink,
      user.name || undefined
    );

    if (!emailResult.success) {
      console.error('Error enviando email de recuperación:', emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error al enviar el email de recuperación. Inténtalo de nuevo.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Error en forgot-password:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}