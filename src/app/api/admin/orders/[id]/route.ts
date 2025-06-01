import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { requireAuth } from "@/libs/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y rol de administrador
    const authResult = await requireAuth(['ADMIN']);
    if (!authResult.isAutenticated) {
      return authResult.response;
    }

    const { id } = await params;

    // Obtener la orden con todas sus relaciones
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Address: true,
        items: {
          include: {
            Product: {
              select: {
                id: true,
                name: true,
                images: {
                  where: {
                    isPrincipal: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Convertir los decimales a strings para serialización
    const serializedOrder = {
      ...order,
      total: order.total.toString(),
      items: order.items.map(item => ({
        ...item,
        price: item.price.toString()
      }))
    };

    return NextResponse.json(serializedOrder);

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
