import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/libs/prisma';
import crypto from 'crypto';

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token es requerido'),
  email: z.string().email('Email inválido')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    const { token, email } = validateTokenSchema.parse(body);

    // Hash del token para comparar con la base de datos
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar token válido en la base de datos
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        token: hashedToken,
        used: false,
        expires: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token inválido o expirado' 
        },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token válido',
      data: {
        email: user.email,
        tokenId: resetToken.id
      }
    });

  } catch (error) {
    console.error('Error en validate-reset-token:', error);

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